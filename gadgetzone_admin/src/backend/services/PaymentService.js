import BaseService from './BaseService.js';
import OrderRepository from '../repositories/OrderRepository.js';
import monCashService from './moncash.service.js';
import stripeService from './stripe.service.js';
import { OrderLog, Boost, Product, Offer, Referral, User, sequelize } from '../models/index.js';
import { notifyNewOrder, notifyPartialPayment } from '../utils/notificationHelper.js';
import { emailQueue, addJob } from '../config/queues.js';

export default class PaymentService extends BaseService {
    constructor() {
        const repository = new OrderRepository();
        super(repository);
    }

    /**
     * Initie un paiement MonCash
     */
    async initiateMonCashPayment(orderId, amount, userId, returnUrl = null) {
        // Redirection logic for regular orders
        const isBoost = String(orderId).startsWith('BOOST_');

        let redirectUrl;
        let paymentToken;
        if (!isBoost) {
            const order = await this.repository.findById(orderId);
            if (!order) throw new Error('Order not found');

            // 🛡️ SÉCURITÉ : Vérifier que la commande appartient à l'utilisateur
            if (userId && order.user_id !== userId) {
                console.error(`❌ Security Violation: User ${userId} tried to initiate payment for Order ${orderId} (Owner: ${order.user_id})`);
                throw new Error('Action interdite : Cette commande ne vous appartient pas.');
            }

            const result = await monCashService.createPayment(orderId, amount, returnUrl);
            redirectUrl = result.redirectUrl;
            paymentToken = result.token;
        } else {
            // Pour les boosts, la vérification peut être faite si nécessaire 
            // (mais le boostId est généralement créé par le vendeur lui-même au moment t)
            const result = await monCashService.createPayment(orderId, amount, returnUrl);
            redirectUrl = result.redirectUrl;
            paymentToken = result.token;
        }

        const token = paymentToken;

        if (token) {
            if (isBoost) {
                const boostId = orderId.replace('BOOST_', '');
                await Boost.update({ payment_token: token }, { where: { id: boostId } });
            } else {
                const order = await this.repository.findById(orderId);
                // 🔗 PROPAGATION DU TOKEN : Si la commande fait partie d'un groupe (multi-vendeurs)
                if (order && order.payment_group_id) {
                    const groupId = order.payment_group_id;
                    const { Order, OrderPayment } = await import('../models/index.js');
                    await Order.update(
                        { payment_token: token, payment_method: 'MonCash' },
                        { where: { payment_group_id: groupId, user_id: order.user_id } }
                    );
                    
                    // Create pending OrderPayment for the group
                    const groupOrders = await Order.findAll({ where: { payment_group_id: groupId, user_id: order.user_id } });
                    for(const o of groupOrders) {
                        await OrderPayment.create({
                            order_id: o.id,
                            amount: amount, // Ideally divided, but for simplicity we log the main amount request
                            status: 'pending',
                            transaction_id: token,
                            payment_method: 'MonCash'
                        });
                    }
                } else {
                    const { OrderPayment } = await import('../models/index.js');
                    await this.repository.update(orderId, {
                        payment_token: token,
                        payment_method: 'MonCash'
                    });
                    await OrderPayment.create({
                        order_id: orderId,
                        amount: amount,
                        status: 'pending',
                        transaction_id: token,
                        payment_method: 'MonCash'
                    });
                }
            }
        }

        return redirectUrl;
    }

    /**
     * Initie un paiement Stripe avec conversion de devises Gourdes -> Dollars
     */
    async initiateStripePayment(orderId, amount, userId, returnUrl = null) {
        const isBoost = String(orderId).startsWith('BOOST_');
        
        // 1. Récupérer le taux de change USD depuis les paramètres
        const { Setting, Boost } = await import('../models/index.js');
        const rateSetting = await Setting.findOne({ where: { category: 'general', key: 'usd_exchange_rate' } });
        const exchangeRate = rateSetting && rateSetting.value ? Number(rateSetting.value) : 135;

        let redirectUrl;
        let paymentToken;

        if (!isBoost) {
            const order = await this.repository.findById(orderId);
            if (!order) throw new Error('Order not found');

            // 🛡️ SÉCURITÉ : Vérifier que la commande appartient à l'utilisateur
            if (userId && order.user_id !== userId) {
                console.error(`❌ Security Violation: User ${userId} tried to initiate Stripe payment for Order ${orderId} (Owner: ${order.user_id})`);
                throw new Error('Action interdite : Cette commande ne vous appartient pas.');
            }

            const result = await stripeService.createPayment(orderId, amount, exchangeRate, returnUrl);
            redirectUrl = result.redirectUrl;
            paymentToken = result.token;
        } else {
            const result = await stripeService.createPayment(orderId, amount, exchangeRate, returnUrl);
            redirectUrl = result.redirectUrl;
            paymentToken = result.token;
        }

        if (paymentToken) {
            if (isBoost) {
                const boostId = orderId.replace('BOOST_', '');
                await Boost.update({ payment_token: paymentToken }, { where: { id: boostId } });
            } else {
                const order = await this.repository.findById(orderId);
                if (order && order.payment_group_id) {
                    const groupId = order.payment_group_id;
                    const { Order } = await import('../models/index.js');
                    await Order.update(
                        { payment_token: paymentToken, payment_method: 'Stripe' },
                        { where: { payment_group_id: groupId, user_id: order.user_id } }
                    );
                } else {
                    await this.repository.update(orderId, {
                        payment_token: paymentToken,
                        payment_method: 'Stripe'
                    });
                }
            }
        }

        return redirectUrl;
    }

    /**
     * Traite un webhook MonCash
     */
    async processMonCashWebhook(payload) {
        console.log('🔔 MonCash Webhook Received:', payload);
        const { OrderLog } = await import('../models/index.js');
        const { orderId, transactionId } = payload;

        // 📝 JOURNALISATION D'AUDIT : Tracer la réception brute du webhook
        try {
            if (orderId) {
                await OrderLog.create({
                    order_id: String(orderId).startsWith('BOOST_') ? null : orderId,
                    action: 'webhook_received',
                    details: JSON.stringify(payload)
                });
            }
        } catch (logError) {
            console.error('⚠️ Could not log incoming webhook:', logError);
        }

        if (!orderId) {
            console.error('❌ Webhook Error: Missing orderId');
            return false;
        }

        const paymentDetails = await monCashService.retrieveOrder(orderId);
        if (paymentDetails && paymentDetails.status === 'successful') {
            const paidAmount = Number(paymentDetails.amount);
            
            if (String(orderId).startsWith('BOOST_')) {
                const boostId = orderId.replace('BOOST_', '');
                const boost = await Boost.findByPk(boostId);
                
                // Vérification du montant pour les boosts
                if (boost && Math.abs(Number(boost.amount) - paidAmount) > 0.01) {
                    console.error(`❌ Webhook Amount Mismatch [Boost ${boostId}]: Expected ${boost.amount}, got ${paidAmount}`);
                    return false;
                }
                
                await this.finalizeBoostPayment(boostId, transactionId || paymentDetails.transaction_id || 'moncash_trans');
            } else if (String(orderId).startsWith('QR_')) {
                const { QRPayment, Wallet, Store } = await import('../models/index.js');
                let ref = orderId.replace(/^QR_/, '');
                let qrPayment = await QRPayment.findOne({ where: { ref } });
                if (!qrPayment) {
                    const lastIdx = ref.lastIndexOf('_');
                    if (lastIdx !== -1) {
                        ref = ref.substring(0, lastIdx);
                        qrPayment = await QRPayment.findOne({ where: { ref } });
                    }
                }
                if (!qrPayment) {
                    console.error(`❌ Webhook Error: QRPayment ${ref} not found`);
                    return false;
                }

                if (qrPayment.status === 'paid') {
                    console.log(`ℹ️ Webhook: QRPayment ${ref} already marked as paid.`);
                    return true;
                }

                // Vérification du montant pour les paiements QR
                if (Math.abs(Number(qrPayment.amount) - paidAmount) > 0.01) {
                    console.error(`❌ Webhook Amount Mismatch [QR ${ref}]: Expected ${qrPayment.amount}, got ${paidAmount}`);
                    return false;
                }

                // Mettre à jour le statut
                qrPayment.status = 'paid';
                qrPayment.transaction_id = transactionId || paymentDetails.transaction_id || 'moncash_qr_trans';
                await qrPayment.save();

                // Créditer directement le solde disponible du vendeur
                const store = await Store.findByPk(qrPayment.store_id);
                if (store) {
                    const [wallet] = await Wallet.findOrCreate({
                        where: { storeId: qrPayment.store_id },
                        defaults: { available_balance: 0, pending_balance: 0 }
                    });

                    wallet.available_balance = Number(wallet.available_balance) + Number(qrPayment.amount);
                    wallet.total_earned = Number(wallet.total_earned) + Number(qrPayment.amount);
                    await wallet.save();

                    // Notification SSE temps réel
                    const sseManager = (await import('../utils/sseManager.js')).default;
                    sseManager.sendToUser(store.userId, 'qr_payment_received', {
                        ref: qrPayment.ref,
                        amount: qrPayment.amount,
                        status: 'paid',
                        created_at: qrPayment.updated_at
                    });

                    console.log(`✅ QRPayment finalized. Store ${qrPayment.store_id} credited with ${qrPayment.amount} HTG.`);
                }
            } else {
                const targetOrder = await this.repository.findById(orderId);
                if (!targetOrder) {
                    console.error(`❌ Webhook Error: Order ${orderId} not found`);
                    return false;
                }

                // 📦 GESTION DES PAIEMENTS GROUPÉS (Multi-vendeurs)
                // On récupère toutes les commandes liées par le même ID de groupe
                const { Order } = await import('../models/index.js');
                const orderGroup = await Order.findAll({
                    where: { payment_group_id: targetOrder.payment_group_id || null, payment_token: targetOrder.payment_token },
                    include: ['items', 'user']
                });

                const groupTotal = orderGroup.reduce((sum, o) => sum + Number(o.total_amount), 0);

                // NOUVEAU: Gestion des paiements partiels (MonCash plafond)
                const { sequelize, OrderPayment, OrderLog } = await import('../models/index.js');
                
                try {
                    await sequelize.transaction(async (t) => {
                        let remainingPayment = paidAmount;
                        
                        for (const o of orderGroup) {
                            const currentTotalPaid = Number(o.total_paid || 0);
                            const orderTotal = Number(o.total_amount);
                            const orderRemainingDue = orderTotal - currentTotalPaid;
                            
                            if (orderRemainingDue <= 0) continue;
                            
                            const amountToApplyToThisOrder = Math.min(orderRemainingDue, remainingPayment);
                            
                            if (amountToApplyToThisOrder > 0) {
                                // Mettre à jour le paiement partiel
                                o.total_paid = currentTotalPaid + amountToApplyToThisOrder;
                                remainingPayment -= amountToApplyToThisOrder;
                                
                                // Marquer les pending OrderPayment associés comme payés (ou en créer un s'il n'y en a pas)
                                const pendingPayment = await OrderPayment.findOne({
                                    where: { order_id: o.id, status: 'pending' },
                                    transaction: t
                                });
                                
                                if (pendingPayment) {
                                    await pendingPayment.update({ status: 'paid', amount: amountToApplyToThisOrder, transaction_id: transactionId || paymentDetails.transaction_id }, { transaction: t });
                                } else {
                                    await OrderPayment.create({
                                        order_id: o.id,
                                        amount: amountToApplyToThisOrder,
                                        status: 'paid',
                                        transaction_id: transactionId || paymentDetails.transaction_id,
                                        payment_method: 'MonCash'
                                    }, { transaction: t });
                                }
                                
                                // Si l'ordre est totalement payé, on le finalise
                                if (o.total_paid >= orderTotal - 0.01) {
                                    await this.finalizePayment(o, transactionId || paymentDetails.transaction_id || 'moncash_trans', t);
                                } else {
                                    o.status = 'partially_paid';
                                    await o.save({ transaction: t });
                                    
                                    await OrderLog.create({
                                        order_id: o.id,
                                        action: 'payment_partial',
                                        details: `Paiement partiel reçu. Montant: ${amountToApplyToThisOrder} HTG. Total payé: ${o.total_paid}/${orderTotal} HTG.`
                                    }, { transaction: t });
                                    
                                    // Notification de paiement partiel
                                    notifyPartialPayment(o, amountToApplyToThisOrder, orderTotal - o.total_paid).catch(e => console.error(e));
                                }
                            }
                        }
                    });
                    console.log(`✅ Payment successfully processed. Total applied: ${paidAmount} HTG`);
                } catch (groupError) {
                    console.error('❌ Error during Atomic Group Finalization:', groupError);
                    throw groupError; // Relancer pour une nouvelle tentative du webhook
                }
            }
            return true;
        }

        console.warn(`⚠️ Payment for Order ${orderId} not verified or failed`);
        return false;
    }

    /**
     * Vérifie un paiement manuellement via son ID de transaction Starbee (depuis le callback frontend)
     */
    async verifyPaymentByTransactionId(transactionId) {
        try {
            console.log(`Verifying transaction: ${transactionId}`);
            const paymentDetails = await monCashService.retrieveOrder(transactionId);
            
            if (paymentDetails && (paymentDetails.status === 'completed' || paymentDetails.status === 'successful')) {
                const ref = paymentDetails.reference_id;
                if (!ref) {
                    console.error('No reference_id found in Starbee payment details');
                    return { success: false };
                }

                // Parser l'orderId (retirer le timestamp à la fin et "ORDER-")
                let orderId = ref;
                const lastUnderscore = orderId.lastIndexOf('_');
                if (lastUnderscore !== -1) {
                    orderId = orderId.substring(0, lastUnderscore);
                }
                orderId = orderId.replace('ORDER-', '');

                // Construire le payload attendu par processMonCashWebhook
                const webhookPayload = {
                    orderId: orderId,
                    transactionId: transactionId,
                    amount: paymentDetails.amount,
                    status: paymentDetails.status
                };

                const isSuccess = await this.processMonCashWebhook(webhookPayload);
                return { success: isSuccess, orderId };
            }
            return { success: false };
        } catch (error) {
            console.error('Error in verifyPaymentByTransactionId:', error);
            return { success: false };
        }
    }

    /**
     * Finalise le paiement d'une commande
     */
    async finalizePayment(order, transactionId, methodOrT = 'MonCash', externalT = null) {
        let method = 'MonCash';
        let transaction = null;

        if (methodOrT && typeof methodOrT === 'object') {
            transaction = methodOrT;
        } else if (typeof methodOrT === 'string') {
            method = methodOrT;
            transaction = externalT;
        }

        const logic = async (t) => {
            // 🔒 VERROUILLAGE ATOMIQUE : Recharger la commande avec un verrou de ligne
            const { Order, OrderItem, Product, Offer, Referral, Wallet, OrderLog, Store } = await import('../models/index.js');
            const lockedOrder = await Order.findByPk(order.id, { 
                transaction: t,
                lock: t.LOCK.UPDATE 
            });

            if (!lockedOrder || lockedOrder.status === 'confirmed') return;

            // 1. Mettre à jour le statut de la commande
            await lockedOrder.update({
                status: 'confirmed',
                confirmed_at: new Date(),
                transaction_id: transactionId,
                payment_method: method
            }, { transaction: t });

            // 2. Décomptage du stock
            for (const item of (lockedOrder.items || order.items || [])) {
                await Product.decrement('stock', { where: { id: item.product_id }, by: item.quantity, transaction: t });
                await Product.increment('sales_count', { where: { id: item.product_id }, by: item.quantity, transaction: t });

                if (item.offer_id) {
                    await Offer.decrement('stock', { where: { id: item.offer_id }, by: item.quantity, transaction: t });
                    await Offer.increment('sales_count', { where: { id: item.offer_id }, by: item.quantity, transaction: t });
                }
            }

            // 2.5 LOGIQUE FINANCIÈRE : Créditer les fonds en attente via snapshot
            const netAmount = Number(lockedOrder.seller_net_amount || 0);
            const storeId = lockedOrder.store_id;

            if (storeId) {
                const [wallet] = await Wallet.findOrCreate({ 
                    where: { storeId },
                    defaults: { available_balance: 0, pending_balance: 0 },
                    transaction: t
                });

                await wallet.increment('pending_balance', { by: netAmount, transaction: t });
            }

            // 3. Gestion des commissions de parrainage
            await Referral.update({ status: 'confirmed' }, { where: { order_id: order.id }, transaction: t });

            // 4. Log de l'action
            await OrderLog.create({
                order_id: order.id,
                action: 'payment_confirmed',
                old_status: lockedOrder.status,
                new_status: 'confirmed',
                details: `Paiement confirmé via ${method}. TransID: ${transactionId}. Stock décompté.`
            }, { transaction: t });
        };

        await this.wrapFinalization(transaction, logic);

        // 5. Notifications et Emails (Post-transaction)
        setImmediate(async () => {
            try {
                const detailedOrder = await this.repository.findDetailed(order.id);
                await notifyNewOrder(detailedOrder);

                if (detailedOrder.user && detailedOrder.user.email) {
                    await addJob(emailQueue, 'order-confirmation', {
                        to: detailedOrder.user.email,
                        subject: `Confirmation de commande #${detailedOrder.order_number || detailedOrder.id}`,
                        data: { orderId: detailedOrder.id, total: detailedOrder.total_amount, customerName: detailedOrder.user.name }
                    });
                }
            } catch (notifyError) {
                console.error('❌ Error during post-payment notifications:', notifyError);
            }
        });
    }

    /**
     * Vérifie manuellement un paiement (Polling)
     */
    async verifyPaymentStatic(orderId) {
        const isBoost = String(orderId).startsWith('BOOST_');
        let orderOrBoost;

        if (isBoost) {
            const boostId = orderId.replace('BOOST_', '');
            orderOrBoost = await Boost.findByPk(boostId);
        } else {
            orderOrBoost = await this.repository.findDetailed(orderId);
        }

        if (!orderOrBoost || orderOrBoost.status !== 'pending') return null;

        const paymentDetails = await monCashService.retrieveOrder(orderId);
        if (paymentDetails && paymentDetails.status === 'successful') {
            const paidAmount = Number(paymentDetails.amount);

            if (isBoost) {
                // Vérification du montant pour les boosts
                if (Math.abs(Number(orderOrBoost.amount) - paidAmount) > 0.01) {
                    console.error(`❌ Verification Amount Mismatch [Boost ${orderOrBoost.id}]: Expected ${orderOrBoost.amount}, got ${paidAmount}`);
                    return false;
                }
                await this.finalizeBoostPayment(orderOrBoost.id, paymentDetails.transaction_id || 'moncash_verify');
            } else {
                // SÉCURITÉ CRITIQUE: Vérification du montant pour les commandes
                // 📦 Support Multi-Vendeurs dans la vérification statique
                let totalToVerify = Number(orderOrBoost.total_amount);
                let ordersToFinalize = [orderOrBoost];

                if (orderOrBoost.payment_group_id) {
                    const { Order } = await import('../models/index.js');
                    const group = await Order.findAll({
                        where: { payment_group_id: orderOrBoost.payment_group_id, payment_token: orderOrBoost.payment_token },
                        include: ['items', 'user']
                    });
                    totalToVerify = group.reduce((sum, o) => sum + Number(o.total_amount), 0);
                    ordersToFinalize = group;
                }

                // NOUVEAU: Support des paiements partiels (MonCash) pour la vérification statique
                const { sequelize, OrderPayment, OrderLog } = await import('../models/index.js');
                
                try {
                    await sequelize.transaction(async (t) => {
                        let remainingPayment = paidAmount;
                        
                        for (const o of ordersToFinalize) {
                            const currentTotalPaid = Number(o.total_paid || 0);
                            const orderTotal = Number(o.total_amount);
                            const orderRemainingDue = orderTotal - currentTotalPaid;
                            
                            if (orderRemainingDue <= 0) continue;
                            
                            const amountToApplyToThisOrder = Math.min(orderRemainingDue, remainingPayment);
                            
                            if (amountToApplyToThisOrder > 0) {
                                // Mettre à jour le paiement partiel
                                o.total_paid = currentTotalPaid + amountToApplyToThisOrder;
                                remainingPayment -= amountToApplyToThisOrder;
                                
                                const pendingPayment = await OrderPayment.findOne({
                                    where: { order_id: o.id, status: 'pending' },
                                    transaction: t
                                });
                                
                                if (pendingPayment) {
                                    await pendingPayment.update({ status: 'paid', amount: amountToApplyToThisOrder, transaction_id: paymentDetails.transaction_id || 'moncash_verify' }, { transaction: t });
                                } else {
                                    await OrderPayment.create({
                                        order_id: o.id,
                                        amount: amountToApplyToThisOrder,
                                        status: 'paid',
                                        transaction_id: paymentDetails.transaction_id || 'moncash_verify',
                                        payment_method: 'MonCash'
                                    }, { transaction: t });
                                }
                                
                                // Si l'ordre est totalement payé, on le finalise
                                if (o.total_paid >= orderTotal - 0.01) {
                                    await this.finalizePayment(o, paymentDetails.transaction_id || 'moncash_verify', t);
                                } else {
                                    o.status = 'partially_paid';
                                    await o.save({ transaction: t });
                                    
                                    await OrderLog.create({
                                        order_id: o.id,
                                        action: 'payment_partial',
                                        details: `Vérification statique: Paiement partiel reçu. Montant: ${amountToApplyToThisOrder} HTG. Total: ${o.total_paid}/${orderTotal} HTG.`
                                    }, { transaction: t });
                                    
                                    // Notification de paiement partiel
                                    notifyPartialPayment(o, amountToApplyToThisOrder, orderTotal - o.total_paid).catch(e => console.error(e));
                                }
                            }
                        }
                    });
                } catch (groupError) {
                    console.error('❌ Error during static verification partial payment:', groupError);
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Vérifie le paiement via le token (transaction ID Starbee)
     */
    async verifyPaymentByTransactionId(transactionId) {
        // Stripe Verification Support
        if (String(transactionId).startsWith('cs_')) {
            const sessionDetails = await stripeService.retrieveSession(transactionId);
            if (sessionDetails && sessionDetails.status === 'successful') {
                const orderId = sessionDetails.orderId;
                const { Order } = await import('../models/index.js');
                const order = await Order.findByPk(orderId);
                if (order) {
                    await this.finalizePayment(order, sessionDetails.payment_intent || transactionId, 'Stripe');
                }
                return { success: true, orderId };
            }
            return { success: false };
        }

        const { Order } = await import('../models/index.js');
        const order = await Order.findOne({ where: { payment_token: transactionId } });
        
        let orderOrBoost;
        let isBoost = false;

        if (order) {
            orderOrBoost = await this.repository.findDetailed(order.id);
        } else {
            const { Boost } = await import('../models/index.js');
            orderOrBoost = await Boost.findOne({ where: { payment_token: transactionId } });
            isBoost = !!orderOrBoost;
        }

        if (!orderOrBoost) {
            console.error(`❌ Verification Error: No order found for transaction ${transactionId}`);
            return { success: false };
        }

        if (orderOrBoost.status === 'confirmed' || orderOrBoost.status === 'active') {
            return { success: true, orderId: orderOrBoost.id }; // Already finalized
        }

        const paymentDetails = await monCashService.retrieveOrder(transactionId);
        if (paymentDetails && paymentDetails.status === 'successful') {
            const paidAmount = Number(paymentDetails.amount);

            if (isBoost) {
                if (Math.abs(Number(orderOrBoost.amount) - paidAmount) > 0.01) {
                    console.error(`❌ Verification Amount Mismatch [Boost ${orderOrBoost.id}]: Expected ${orderOrBoost.amount}, got ${paidAmount}`);
                    return { success: false };
                }
                await this.finalizeBoostPayment(orderOrBoost.id, paymentDetails.transaction_id || transactionId);
            } else {
                let totalToVerify = Number(orderOrBoost.total_amount);
                let ordersToFinalize = [orderOrBoost];

                if (orderOrBoost.payment_group_id) {
                    const group = await Order.findAll({
                        where: { payment_group_id: orderOrBoost.payment_group_id, payment_token: orderOrBoost.payment_token },
                        include: ['items', 'user']
                    });
                    totalToVerify = group.reduce((sum, o) => sum + Number(o.total_amount), 0);
                    ordersToFinalize = group;
                }

                if (Math.abs(totalToVerify - paidAmount) > 0.01) {
                    console.error(`❌ Verification Amount Mismatch: Expected ${totalToVerify}, got ${paidAmount}`);
                    return { success: false };
                }

                for (const o of ordersToFinalize) {
                    await this.finalizePayment(o, paymentDetails.transaction_id || transactionId);
                }
            }
            return { success: true, orderId: orderOrBoost.id };
        }
        
        return { success: false };
    }

    /**
     * Finalise le paiement d'un Boost
     */
    async finalizeBoostPayment(boostId, transactionId) {
        await sequelize.transaction(async (t) => {
            // 🔒 VERROUILLAGE ATOMIQUE : Recharger le boost avec verrou
            const lockedBoost = await Boost.findByPk(boostId, { 
                transaction: t,
                lock: t.LOCK.UPDATE 
            });

            if (!lockedBoost || lockedBoost.status !== 'pending') return;

            const now = new Date();
            const endsAt = new Date(now.getTime() + lockedBoost.duration_days * 24 * 60 * 60 * 1000);

            await lockedBoost.update({
                status: 'active',
                transaction_id: transactionId,
                startsAt: now,
                endsAt: endsAt,
                updated_at: now
            }, { transaction: t });

            // Activer le flag sur le produit pour un accès rapide
            await Product.update(
                { is_sponsored: true },
                { where: { id: lockedBoost.productId }, transaction: t }
            );
        });

        console.log(`🚀 Boost ${boostId} partially activated and Product marked.`);
    }

    /**
     * Moteur de RÉCONCILIATION : Rattrapage proactif des paiements manqués (Phase 12)
     * Utile si le Webhook ET le Polling échouent simultanément.
     */
    async reconcilePendingPayments() {
        const { Order } = await import('../models/index.js');
        const { Op } = (await import('sequelize')).default;
        
        // On vérifie les commandes de plus de 30 minutes mais de moins de 24h
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pendingOrders = await Order.findAll({
            where: {
                status: 'payment_pending',
                created_at: { [Op.between]: [yesterday, thirtyMinutesAgo] }
            }
        });

        console.log(`🔍 Reconciliation: Scanning ${pendingOrders.length} pending orders...`);
        let recovered = 0;

        for (const order of pendingOrders) {
            try {
                // Interroger MonCash pour connaître le statut réel
                const paymentDetails = await monCashService.retrieveOrder(order.id);
                
                if (paymentDetails && paymentDetails.status === 'successful') {
                    console.log(`🎯 Reconciliation SUCCESS for Order #${order.id}. Finalizing...`);
                    // On utilise le webhook logic pour finaliser (groupés ou non)
                    await this.processMonCashWebhook(paymentDetails);
                    recovered++;
                }
            } catch (err) {
                console.error(`❌ Reconciliation failed for Order #${order.id}:`, err.message);
            }
        }

        return { scanned: pendingOrders.length, recovered };
    }

    // Aide pour gérer la fin du bloc finalizePayment
    async wrapFinalization(externalT, logic) {
        if (externalT) {
            await logic(externalT);
        } else {
            const { sequelize } = await import('../models/index.js');
            await sequelize.transaction(async (t) => {
                await logic(t);
            });
        }
    }
}
