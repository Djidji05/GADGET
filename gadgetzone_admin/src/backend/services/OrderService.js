import BaseService from './BaseService.js';
import OrderRepository from '../repositories/OrderRepository.js';
import { Order, Product, User, Referral, OrderLog, Offer, Store, Wallet, OrderItem, OrderTracking, sequelize, LoyaltyAccount, LoyaltyTransaction, FlashSale } from '../models/index.js';
import { notifyNewOrder, notifyOrderStatusChange } from '../utils/notificationHelper.js';
import TrustScoreService from './TrustScoreService.js';
import { sendToUser } from '../utils/sseManager.js';
import loyaltyService from './loyaltyService.js';
import crypto from 'crypto';

export default class OrderService extends BaseService {
    constructor() {
        const repository = new OrderRepository();
        super(repository);
    }

    async getMyOrders(userId, options) {
        return await this.repository.findByUser(userId, options);
    }

    async getOrderDetails(id) {
        return await this.repository.findDetailed(id);
    }

    async createOrder(data) {
        console.log('📝 OrderService.createOrder: Processing payload', JSON.stringify(data, null, 2));
        const user_id = data.user_id || data.userId;
        const items = data.items;
        const shipping_address = data.shipping_address || data.shippingAddress;
        const shipping_coordinates = data.shipping_coordinates || data.shippingCoordinates;
        const reference_point = data.reference_point || data.referencePoint;
        const referral_code = data.referral_code || data.referralCode;
        const payment_method = data.payment_method || data.paymentMethod;
        const points_to_use = data.points_to_use || data.pointsToUse;


        return await sequelize.transaction(async (t) => {
            const user = await User.findByPk(user_id, { transaction: t });
            if (!user) throw new Error('User not found');

            // Find user's store (if any) to prevent self-purchases
            const userStore = await Store.findOne({ where: { userId: user_id }, transaction: t });

            // 1. Fetch products & Validate Stock
            const itemsWithOffers = [];
            const { Op } = (await import('sequelize')).default;

            for (const item of items) {
                const actualProductId = item.product_id || item.productId;

                // 🛡️ SÉCURITÉ : Bloquer les quantités négatives ou nulles (Vecteur de Vol)
                if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
                    throw new Error(`Quantité invalide pour le produit ${actualProductId}. La quantité doit être un nombre entier positif.`);
                }

                const product = await Product.findByPk(actualProductId, { transaction: t });
                if (!product) throw new Error(`Produit ${actualProductId} introuvable`);

                if (!product.storeId) {
                    throw new Error(`Le produit ${product.name} n'a pas de vendeur attribué (storeId manquant).`);
                }

                // 🛡️ SÉCURITÉ : Bloquer le vendeur s'il essaie d'acheter son propre produit
                if (userStore && product.storeId === userStore.id) {
                    throw new Error(`Vous ne pouvez pas acheter vos propres produits (${product.name}).`);
                }

                // ⚡ VENTES FLASH : Vérifier s'il existe une vente flash active pour ce produit
                const now = new Date();
                const activeFlashSale = await FlashSale.findOne({
                    where: {
                        product_id: actualProductId,
                        status: 'active',
                        start_at: { [Op.lte]: now },
                        end_at: { [Op.gte]: now }
                    },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                let itemPrice = Number(product.price);
                if (activeFlashSale) {
                    // Si limite de stock configurée, vérifier la disponibilité
                    if (activeFlashSale.stock_limit === null || activeFlashSale.current_stock > 0) {
                        if (activeFlashSale.stock_limit !== null && activeFlashSale.current_stock < item.quantity) {
                            throw new Error(`Stock insuffisant en Vente Flash pour le produit ${product.name} (Disponible : ${activeFlashSale.current_stock}).`);
                        }
                        itemPrice = Number(activeFlashSale.flash_price);

                        // Réserver le stock de la vente flash
                        if (activeFlashSale.stock_limit !== null) {
                            await activeFlashSale.decrement('current_stock', { by: item.quantity, transaction: t });
                        }
                    }
                } else {
                    // 🏷️ PROMOTIONS AUTOMATIQUES : Appliquer les promotions actives
                    const { applyPromotionsToProduct } = await import('../utils/promotionHelper.js');
                    const processedProduct = await applyPromotionsToProduct(product);
                    itemPrice = Number(processedProduct.price);
                }

                itemsWithOffers.push({
                    ...item,
                    product,
                    price: itemPrice,
                    storeId: product.storeId
                });
            }

            // 🛡️ POINTS FIDELITÉ : Calculer et valider la réduction
            let pointsToUse = Number(points_to_use) || 0;
            let overallDiscount = 0;
            let overallSubtotal = itemsWithOffers.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

            if (pointsToUse > 0) {
                const loyaltyAccount = await LoyaltyAccount.findOne({ 
                    where: { user_id }, 
                    transaction: t,
                    lock: t.LOCK.UPDATE 
                });
                if (!loyaltyAccount || loyaltyAccount.points_balance < pointsToUse) {
                    throw new Error('Solde de points insuffisant');
                }
                
                // Calcul de la réduction (5 HTG par tranche de 100 points)
                let calculatedDiscount = Math.floor(pointsToUse / 100) * 5;
                const maxDiscount = Math.floor(overallSubtotal * 0.5);
                
                if (calculatedDiscount > maxDiscount) {
                    overallDiscount = maxDiscount;
                    // Recalculer les points nécessaires (20 points = 1 HTG de réduction)
                    pointsToUse = Math.ceil(overallDiscount / 5) * 100;
                } else {
                    overallDiscount = calculatedDiscount;
                }
                
                // Mettre à jour le solde de points de l'utilisateur avec la valeur ajustée
                if (pointsToUse > 0) {
                    await loyaltyAccount.decrement('points_balance', { by: pointsToUse, transaction: t });
                }
            }

            // 2. Group by Store
            const itemsByStore = {};
            for (const item of itemsWithOffers) {
                const storeId = item.storeId;
                if (!itemsByStore[storeId]) itemsByStore[storeId] = [];
                itemsByStore[storeId].push({
                    product_id: item.product_id || item.productId,
                    quantity: item.quantity,
                    price: item.price
                });
            }

            // 3. Create orders per store
            const ambassador = referral_code ? await User.findOne({ where: { referral_code, is_ambassador: true }, transaction: t }) : null;
            const createdOrders = [];
            const groupPaymentToken = `GRP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            let remainingPointsToAllocate = pointsToUse;
            const itemsByStoreKeys = Object.keys(itemsByStore);

            for (let i = 0; i < itemsByStoreKeys.length; i++) {
                const storeId = itemsByStoreKeys[i];
                const storeItems = itemsByStore[storeId];
                let subtotalAmount = storeItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

                let storeDiscount = 0;
                if (overallDiscount > 0 && overallSubtotal > 0) {
                    const ratio = subtotalAmount / overallSubtotal;
                    storeDiscount = Math.round(overallDiscount * ratio);
                }

                let storePointsSpent = 0;
                if (pointsToUse > 0 && overallSubtotal > 0) {
                    if (i === itemsByStoreKeys.length - 1) {
                        storePointsSpent = remainingPointsToAllocate;
                    } else {
                        const ratio = subtotalAmount / overallSubtotal;
                        storePointsSpent = Math.round(pointsToUse * ratio);
                        remainingPointsToAllocate -= storePointsSpent;
                    }
                }

                const store = await Store.findByPk(storeId, { transaction: t });
                const commissionRate = store ? Number(store.commission_rate || 5) : 5; // Par défaut 5%

                let shippingFee = 250; // Fallback par défaut
                let deliveryCity = '';
                try {
                    const addressObj = typeof shipping_address === 'string' ? JSON.parse(shipping_address) : shipping_address;
                    deliveryCity = addressObj?.city?.trim() || '';
                } catch (e) {
                    deliveryCity = '';
                }

                let deliverable = true;
                if (store) {
                    let settings = store.settings;
                    if (typeof settings === 'string') {
                        try { settings = JSON.parse(settings); } catch (e) { settings = {}; }
                    }
                    if (settings?.shipping?.enabledZones && Array.isArray(settings.shipping.enabledZones)) {
                        const matchedZone = settings.shipping.enabledZones.find(z => z.city && z.city.toLowerCase() === deliveryCity.toLowerCase());
                        if (matchedZone) {
                            if (matchedZone.deliverable === false) {
                                deliverable = false;
                            } else {
                                const baseFee = Number(matchedZone.baseFee) || 0;
                                const perItemFee = Number(matchedZone.perItemFee) || 0;
                                
                                const totalQty = storeItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
                                shippingFee = baseFee + Math.max(0, totalQty - 1) * perItemFee;
                            }
                        } else {
                            if (settings.shipping.setupCompleted) {
                                deliverable = false;
                            }
                        }
                    }
                }

                if (!deliverable) {
                    throw new Error(`La boutique "${store?.name || 'Vendeur'}" ne livre pas à "${deliveryCity || 'cette destination'}".`);
                }

                let monCashFee = 0;
                const sellerNetAmount = Math.round(Math.max(0, subtotalAmount - storeDiscount) * (1 - (commissionRate / 100)) + shippingFee);
                const totalAmount = Math.max(0, subtotalAmount + shippingFee + monCashFee - storeDiscount);
                const roundedTotal = Math.round(totalAmount);
                const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                const order = await this.repository.createWithItems({
                    user_id,
                    store_id: Number(storeId), // 🏷️ Attribution directe de la boutique (Phase 13)
                    total_amount: roundedTotal,
                    status: 'payment_pending',
                    order_number: orderNumber,
                    delivery_token: crypto.randomBytes(8).toString('hex').toUpperCase(), // 🔑 Jeton unique pour Scan-to-Confirm
                    seller_commission_rate: commissionRate,
                    seller_net_amount: sellerNetAmount,
                    shipping_address: typeof shipping_address === 'object' ? JSON.stringify(shipping_address) : shipping_address,
                    shipping_coordinates: shipping_coordinates || null,
                    reference_point: reference_point || null,
                    payment_method: payment_method ? JSON.stringify(payment_method) : null,
                    payment_group_id: groupPaymentToken // 🔗 Lien permanent multi-vendeurs
                }, storeItems, { transaction: t });

                // Enregistrer la transaction de fidélité par commande pour remboursement individuel possible
                if (storePointsSpent > 0) {
                    await LoyaltyTransaction.create({
                        user_id,
                        order_id: order.id,
                        points_spent: storePointsSpent,
                        reason: 'purchase_redeem',
                        description: `Points utilisés pour la réduction sur la commande #${order.id}`
                    }, { transaction: t });
                }

                // Referral commission (Initialisation en attente de paiement)
                if (ambassador && ambassador.id !== user_id) {
                    await Referral.create({
                        ambassador_id: ambassador.id,
                        referred_user_id: user_id,
                        order_id: order.id,
                        commission_amount: totalAmount * 0.05,
                        status: 'pending'
                    }, { transaction: t });
                }

                createdOrders.push(order);
            }

            return {
                id: createdOrders[0].id,
                orderIds: createdOrders.map(o => o.id),
                totalOrders: createdOrders.length,
                totalAmount: createdOrders.reduce((acc, o) => acc + Number(o.total_amount), 0)
            };
        });

        // 📡 SSE : Notifier chaque vendeur concerné en temps réel (après commit transaction)
        setImmediate(async () => {
            try {
                // Récupérer les vendeurs liés aux boutiques de la commande
                const storeIds = [...new Set(items.map(i => i.storeId).filter(Boolean))];
                for (const storeId of storeIds) {
                    const store = await Store.findByPk(storeId, { include: [{ model: User, as: 'owner', attributes: ['id'] }] });
                    if (store?.owner?.id) {
                        sendToUser(store.owner.id, 'new_order', {
                            message: 'Nouvelle commande reçue !',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            } catch (err) {
                console.error('❌ SSE [new_order]:', err.message);
            }
        });
    }

    async updateStatus(id, newStatus, userId) {
        return await sequelize.transaction(async (t) => {
            // 🔒 VERROUILLAGE ATOMIQUE : Bloquer la ligne en base jusqu'à la fin de la transaction.
            const order = await Order.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!order) throw new Error('Order not found');

            // 🛡️ SÉCURITÉ SCAN-TO-CONFIRM : Interdire le passage manuel à 'delivered'
            // Cette transition ne DOIT se faire que via le scan du code QR client.
            if (newStatus === 'delivered') {
                throw new Error('La transition vers "Livré" nécessite obligatoirement la validation par scan du code client.');
            }

            const oldStatus = order.status;
            if (oldStatus === newStatus) return order;

            // 🛡️ PROTECTION PAIEMENT INTÉGRAL: 
            if (newStatus === 'confirmed' && !order.transaction_id) {
                throw new Error('Action refusée : Impossible de confirmer la commande sans une validation de paiement MonCash (ID de transaction manquant).');
            }

            // 🛡️ PROTECTION FLUX LOGISTIQUE :
            if ((newStatus === 'shipped' || newStatus === 'delivered') && (oldStatus === 'payment_pending' || oldStatus === 'pending')) {
                throw new Error(`Action refusée : Impossible de passer au statut '${newStatus}' car la commande n'a pas encore été confirmée par un paiement.`);
            }

            const updated = await order.update({
                status: newStatus,
                confirmed_at: newStatus === 'confirmed' ? new Date() : order.confirmed_at,
                shipped_at: newStatus === 'shipped' ? new Date() : order.shipped_at,
                delivered_at: newStatus === 'delivered' ? new Date() : order.delivered_at
            }, { transaction: t });

            await OrderLog.create({
                order_id: id,
                user_id: userId,
                action: 'status_change',
                old_status: oldStatus,
                new_status: newStatus,
                details: `Status changed from ${oldStatus} to ${newStatus}`
            }, { transaction: t });

            // ⚖️ LOGIQUE FINANCIÈRE (Incorpée pour intégrité totale)
            if (newStatus === 'delivered') {
                const items = await OrderItem.findAll({ 
                    where: { order_id: id },
                    include: [{ model: Product, as: 'product' }],
                    transaction: t
                });
                
                if (items.length > 0) {
                    const storeId = items[0].product.storeId;
                    const store = await Store.findByPk(storeId, { transaction: t });
                    
                    if (store) {
                        // 💸 UTILISATION DU SNAPSHOT : On utilise le montant net figé lors du paiement
                        // pour garantir la cohérence financière, même si les taux de la boutique changent.
                        const netAmount = Number(order.seller_net_amount) > 0 
                            ? Number(order.seller_net_amount) 
                            : (items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0) * (1 - Number(store.commission_rate) / 100));

                        const [wallet] = await Wallet.findOrCreate({ 
                            where: { storeId },
                            defaults: { available_balance: 0, pending_balance: 0 },
                            transaction: t
                        });

                        // 🔄 TRANSFERT : Libération des fonds (Pending -> Available)
                        await wallet.decrement('pending_balance', { by: netAmount, transaction: t });
                        await wallet.increment('available_balance', { by: netAmount, transaction: t });
                        await wallet.increment('total_earned', { by: netAmount, transaction: t });
                        
                        // Action asynchrone sécurisée car le score n'est pas critique pour la finance
                        setImmediate(() => TrustScoreService.calculateStoreScore(storeId).catch(console.error));
                    }
                }

                // 🌟 POINTS FIDELITÉ : 1 point par HTG dépensé (non-bloquant)
                setImmediate(async () => {
                    try {
                        const pointsToAdd = Math.floor(Number(order.total_amount));
                        if (pointsToAdd > 0) {
                            await loyaltyService.addPoints(
                                order.user_id,
                                pointsToAdd,
                                `Commande #${id} livrée — +${pointsToAdd} pts`
                            );

                            // Check and unlock achievements
                            await loyaltyService.unlockAchievement(order.user_id, 'first_purchase');

                            const totalSpent = await Order.sum('total_amount', {
                                where: { user_id: order.user_id, status: 'delivered' }
                            });
                            if (totalSpent >= 10000) {
                                await loyaltyService.unlockAchievement(order.user_id, 'big_spender');
                            }
                        }
                    } catch (err) {
                        console.error('❌ Points fidélité [updateOrderStatus]:', err.message);
                    }
                });
            }

            notifyOrderStatusChange(updated, oldStatus, newStatus).catch(console.error);
            return updated;
        });
    }

    async cancelOrder(id, userId, role) {
        const order = await this.getOrderDetails(id);
        if (!order) throw new Error('Order not found');
        if (order.user_id !== userId && role !== 'admin') throw new Error('Unauthorized');
        // Autoriser l'annulation si la commande n'est pas encore expédiée ou livrée
        const cancellableStatuses = ['payment_pending', 'pending', 'confirmed'];
        if (!cancellableStatuses.includes(order.status)) {
            throw new Error(`Impossible d'annuler une commande au statut '${order.status}'.`);
        }
        
        // 🔑 Capturer le statut actuel AVANT la transaction pour la logique financière
        const oldStatus = order.status;

        return await sequelize.transaction(async (t) => {
            for (const item of order.items) {
                await Product.increment('stock', { where: { id: item.product_id }, by: item.quantity, transaction: t });
                
                // 📦 RÉAPPROVISIONNEMENT DU STOCK VENDEUR (OFFRE)
                if (item.offer_id) {
                    await Offer.increment('stock', { where: { id: item.offer_id }, by: item.quantity, transaction: t });
                }

                // ⚡ RÉAPPROVISIONNEMENT DE LA VENTE FLASH SI EXISTANTE ET ACTIVE
                const activeFlashSale = await FlashSale.findOne({
                    where: {
                        product_id: item.product_id,
                        status: 'active'
                    },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });
                if (activeFlashSale && activeFlashSale.stock_limit !== null) {
                    const toRestore = Math.min(item.quantity, activeFlashSale.stock_limit - activeFlashSale.current_stock);
                    if (toRestore > 0) {
                        await activeFlashSale.increment('current_stock', { by: toRestore, transaction: t });
                    }
                }
            }

            // 🚫 ANNULER LES COMMISSIONS DE PARRAINAGE
            await Referral.update({ status: 'cancelled' }, { where: { order_id: id }, transaction: t });

            // 💸 RÉVERSION DES POINTS DE FIDELITÉ
            const loyaltyTx = await LoyaltyTransaction.findOne({
                where: { order_id: id, reason: 'purchase_redeem' },
                transaction: t
            });
            if (loyaltyTx && loyaltyTx.points_spent > 0) {
                const loyaltyAccount = await LoyaltyAccount.findOne({ where: { user_id: order.user_id }, transaction: t });
                if (loyaltyAccount) {
                    await loyaltyAccount.increment('points_balance', { by: loyaltyTx.points_spent, transaction: t });
                    await LoyaltyTransaction.create({
                        user_id: order.user_id,
                        order_id: id,
                        points_earned: loyaltyTx.points_spent,
                        reason: 'purchase_refund',
                        description: `Restitution de ${loyaltyTx.points_spent} points suite à l'annulation de la commande #${id}`
                    }, { transaction: t });
                }
            }

            // 💸 RÉVERSION FINANCIÈRE (Pending Balance)
            if (oldStatus === 'confirmed' || oldStatus === 'pending') {
                const orderItems = await OrderItem.findAll({ 
                    where: { order_id: id },
                    include: [{ model: Product, as: 'product' }],
                    transaction: t
                });
                
                if (orderItems.length > 0) {
                    const storeId = orderItems[0].product.storeId;
                    const wallet = await Wallet.findOne({ where: { storeId }, transaction: t });
                    
                    if (wallet) {
                        // 💸 RÉVERSION VIA SNAPSHOT : On utilise le montant net enregistré
                        const netToRevert = Number(order.seller_net_amount) > 0
                            ? Number(order.seller_net_amount)
                            : (orderItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0) * (1 - (order.seller_commission_rate || 0)/100));

                        // 🛡️ SÉCURITÉ PENDING : Vérifier que le solde est suffisant pour annuler
                        if (Number(wallet.pending_balance) < netToRevert) {
                            console.warn(`⚠️ Nettoyage financier : Solde en attente insuffisant pour l'ordre #${id}. Mise à zéro du solde au lieu d'un débit négatif.`);
                            await wallet.update({ pending_balance: 0 }, { transaction: t });
                        } else {
                            await wallet.decrement('pending_balance', { by: netToRevert, transaction: t });
                        }
                    }
                }
            }

            const updated = await order.update({ status: 'cancelled' }, { transaction: t });

            await OrderLog.create({
                order_id: id,
                user_id: userId,
                action: 'cancelled',
                old_status: oldStatus,
                new_status: 'cancelled',
                details: 'Order cancelled by user/admin. Stock and Referral reverted.'
            }, { transaction: t });

            notifyOrderStatusChange(updated, oldStatus, 'cancelled').catch(console.error);
            return updated;
        });
    }

    /**
     * Valide la livraison via leScan du Jeton Client (Phase 13 - Scan-to-Confirm)
     * Déclenche automatiquement le paiement du vendeur.
     */
    async verifyDeliveryScan(id, token, actorId) {
        return await sequelize.transaction(async (t) => {
            const order = await Order.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!order) throw new Error('Commande introuvable.');

            // 1. Vérification du jeton
            if (order.delivery_token !== token.trim().toUpperCase()) {
                throw new Error('Code de livraison invalide.');
            }

            // 2. Vérification d'autorisation (Vendeur assigné ou Admin)
            const actor = await User.findByPk(actorId, { include: ['store'], transaction: t });
            const isOwner = actor.store && actor.store.id === order.store_id;
            const isAdmin = actor.role === 'admin';

            if (!isOwner && !isAdmin) {
                throw new Error('Accès refusé : Seul le vendeur de cette commande peut valider la livraison.');
            }

            // 3. Validation de l'état actuel
            if (order.status !== 'shipped' && order.status !== 'confirmed') {
                throw new Error(`La commande doit être en statut "Expédiée" pour être validée (Statut actuel : ${order.status}).`);
            }

            // 4. Exécuter la transition vers Delivered
            const oldStatus = order.status;
            await order.update({
                status: 'delivered',
                delivered_at: new Date()
            }, { transaction: t });

            // 5. Création du log de suivi (Tracking history)
            await OrderTracking.create({
                order_id: id,
                status: 'delivered',
                description: 'Livraison confirmée par scan du code client.',
                location: 'Point de remise'
            }, { transaction: t });

            // ⚖️ LOGIQUE FINANCIÈRE : Libération des fonds (Pending -> Available)
            // Comme l'ordre est déjà divisé par vendeur, on crédite la totalité du net vendeur snapshot.
            const [wallet] = await Wallet.findOrCreate({ 
                where: { storeId: order.store_id },
                defaults: { available_balance: 0, pending_balance: 0 },
                transaction: t 
            });

            if (wallet) {
                const netAmount = Number(order.seller_net_amount);
                console.log(`💰 Crédit portefeuille SIM : ${netAmount} G pour la boutique ${order.store_id}`);
                
                // On décrémente le pending (si positif) et on incrémente l'available
                // Note: En mode "Scan", on fait une libération atomique.
                await wallet.decrement('pending_balance', { by: netAmount, transaction: t });
                await wallet.increment('available_balance', { by: netAmount, transaction: t });
                await wallet.increment('total_earned', { by: netAmount, transaction: t });
                
                setImmediate(() => TrustScoreService.calculateStoreScore(order.store_id).catch(console.error));

                // 🌟 POINTS FIDELITÉ : 1 point par HTG dépensé (non-bloquant)
                setImmediate(async () => {
                    try {
                        const pointsToAdd = Math.floor(Number(order.total_amount));
                        if (pointsToAdd > 0) {
                            await loyaltyService.addPoints(
                                order.user_id,
                                pointsToAdd,
                                `Commande #${id} livrée — +${pointsToAdd} pts`
                            );

                            // Check and unlock achievements
                            await loyaltyService.unlockAchievement(order.user_id, 'first_purchase');

                            const totalSpent = await Order.sum('total_amount', {
                                where: { user_id: order.user_id, status: 'delivered' }
                            });
                            if (totalSpent >= 10000) {
                                await loyaltyService.unlockAchievement(order.user_id, 'big_spender');
                            }
                        }
                    } catch (err) {
                        console.error('❌ Points fidélité [verifyDeliveryScan]:', err.message);
                    }
                });
            }

            notifyOrderStatusChange(order, oldStatus, 'delivered').catch(console.error);
            return { message: 'Livraison validée avec succès.', orderId: id };
        });
    }

    /**
     * Nettoie les commandes abandonnées en paiement (Phase 12 - Hygiène)
     * Utile pour libérer le stock théorique et nettoyer la base de données.
     */
    async cleanupAbandonedOrders(externalT = null) {
        const { Op } = (await import('sequelize')).default;
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const logic = async (t) => {
            const abandonedOrders = await Order.findAll({
                where: {
                    status: 'payment_pending',
                    created_at: { [Op.lt]: twoHoursAgo }
                },
                transaction: t
            });

            for (const order of abandonedOrders) {
                console.log(`🧹 Cleaning up abandoned order #${order.id}`);
                await this.cancelOrder(order.id, null, 'system', t);
            }
            return abandonedOrders.length;
        };

        if (externalT) return await logic(externalT);
        return await sequelize.transaction(logic);
    }

    async calculateShippingFee(items, shippingAddress) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return { shippingFee: 0, breakdown: {} };
        }
        
        const deliveryCity = shippingAddress?.city?.trim() || '';
        
        // Group by store
        const storeQuantities = {};
        const storeSubtotals = {};
        for (const item of items) {
            const actualProductId = item.productId || item.product_id;
            const product = await Product.findByPk(actualProductId);
            if (!product) continue;
            
            const storeId = product.storeId;
            if (!storeId) continue;
            
            storeQuantities[storeId] = (storeQuantities[storeId] || 0) + (Number(item.quantity) || 1);
            storeSubtotals[storeId] = (storeSubtotals[storeId] || 0) + (Number(product.price) * (Number(item.quantity) || 1));
        }
        
        let totalShippingFee = 0;
        const breakdown = {};
        
        for (const storeId of Object.keys(storeQuantities)) {
            const store = await Store.findByPk(storeId);
            let shippingFee = 250; // Fallback par défaut
            let deliverable = true;
            
            if (store) {
                let settings = store.settings;
                if (typeof settings === 'string') {
                    try { settings = JSON.parse(settings); } catch (e) { settings = {}; }
                }
                if (settings?.shipping?.enabledZones && Array.isArray(settings.shipping.enabledZones)) {
                    const matchedZone = settings.shipping.enabledZones.find(z => z.city && z.city.toLowerCase() === deliveryCity.toLowerCase());
                    if (matchedZone) {
                        if (matchedZone.deliverable === false) {
                            deliverable = false;
                            shippingFee = 0;
                        } else {
                            const baseFee = Number(matchedZone.baseFee) || 0;
                            const perItemFee = Number(matchedZone.perItemFee) || 0;
                            
                            const totalQty = storeQuantities[storeId] || 1;
                            shippingFee = baseFee + Math.max(0, totalQty - 1) * perItemFee;
                        }
                    } else {
                        if (settings.shipping.setupCompleted) {
                            deliverable = false;
                            shippingFee = 0;
                        }
                    }
                }
            }
            breakdown[storeId] = {
                shippingFee,
                deliverable,
                storeName: store?.name || 'Vendeur'
            };
            if (deliverable) {
                totalShippingFee += shippingFee;
            }
        }
        
        const allDeliverable = Object.values(breakdown).every(b => b.deliverable);
        
        return {
            shippingFee: totalShippingFee,
            deliverable: allDeliverable,
            breakdown
        };
    }
}
