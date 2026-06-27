import { Notification, User, Order, OrderItem, Product, Store, Dispute, DisputeMessage, sequelize } from '../models/index.js';
const { Op } = sequelize;
import { sendEmail } from '../services/emailService.js';
import { sendWhatsApp } from '../services/whatsappService.js';
import { notificationQueue, addJob } from '../config/queues.js';

/**
 * Utilitaire pour créer des notifications
 */

/**
 * Crée une notification pour un utilisateur spécifique
 * @param {number} userId - ID de l'utilisateur
 * @param {string} type - Type de notification (info, success, warning, error, project, order)
 * @param {string} title - Titre de la notification
 * @param {string} message - Message de la notification
 * @param {object} options - Options additionnelles (relatedId, relatedType, metadata)
 * @returns {Promise<Notification|null>}
 */
export async function createNotification(userId, type, title, message, options = {}) {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            status: 'unread',
            relatedId: options.relatedId || null,
            relatedType: options.relatedType || null,
            metadata: options.metadata || null
        });

        return notification;
    } catch (error) {
        // Ne pas bloquer le flux principal en cas d'erreur
        console.error('❌ Erreur création notification:', error);
        return null;
    }
}

/**
 * Notifie tous les administrateurs
 * @param {string} type - Type de notification
 * @param {string} title - Titre
 * @param {string} message - Message
 * @param {object} options - Options additionnelles
 * @returns {Promise<number>} Nombre de notifications créées
 */
export async function notifyAllAdmins(type, title, message, options = {}) {
    try {
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: ['id']
        });

        // Create notifications in parallel
        const promises = admins.map(admin =>
            createNotification(admin.id, type, title, message, options)
        );

        const results = await Promise.all(promises);
        const count = results.filter(n => n !== null).length;

        console.log(`✅ ${count} admin(s) notifié(s): ${title}`);
        return count;
    } catch (error) {
        console.error('❌ Erreur notification admins:', error);
        return 0;
    }
}

/**
 * Notifie les utilisateurs d'un rôle spécifique
 * @param {string} role - Rôle (admin, gestionnaire, user)
 * @param {string} type - Type de notification
 * @param {string} title - Titre
 * @param {string} message - Message
 * @param {object} options - Options additionnelles
 * @returns {Promise<number>} Nombre de notifications créées
 */
export async function notifyByRole(role, type, title, message, options = {}) {
    try {
        const users = await User.findAll({
            where: { role },
            attributes: ['id']
        });

        // Create notifications in parallel
        const promises = users.map(user =>
            createNotification(user.id, type, title, message, options)
        );

        const results = await Promise.all(promises);
        const count = results.filter(n => n !== null).length;

        console.log(`✅ ${count} utilisateur(s) avec rôle "${role}" notifié(s): ${title}`);
        return count;
    } catch (error) {
        console.error(`❌ Erreur notification rôle ${role}:`, error);
        return 0;
    }
}

/**
 * Notifie pour une nouvelle commande
 * @param {object} order - Objet commande
 * @returns {Promise<number>}
 */
/**
 * Notifie pour une nouvelle commande
 * @param {object} order - Objet commande
 * @returns {Promise<number>}
 */
export async function notifyNewOrder(order) {
    const title = `Nouvelle commande #${order.order_number || order.id}`;
    const message = `Commande de ${order.user?.name || 'Client'} pour ${order.total_amount} HTG`;

    // 1. Offload Admin Notification to Queue (Async)
    await addJob(notificationQueue, 'admin-alert', {
        type: 'order',
        title,
        message,
        options: {
            relatedId: order.id,
            relatedType: 'order',
            metadata: {
                orderId: order.id,
                amount: order.total_amount,
                userId: order.user_id
            }
        }
    });

    // 2. Notifier les Vendeurs concernés
    try {
        const orderItems = await OrderItem.findAll({
            where: { order_id: order.id },
            include: [{
                model: Product,
                as: 'product',
                include: [{
                    model: Store,
                    as: 'store',
                    include: [{ model: User, as: 'owner', attributes: ['id', 'email', 'name', 'phone', 'whatsapp'] }]
                }]
            }]
        });

        const storeOwners = orderItems
            .map(item => item.product?.store?.owner)
            .filter((owner, index, self) => owner && self.findIndex(o => o.id === owner.id) === index);

        for (const owner of storeOwners) {
            // Notification In-App Vendeur
            await createNotification(owner.id, 'order', 'Nouvelle vente ! 🎉', `Vous avez reçu une nouvelle commande #${order.order_number || order.id} d'une valeur de ${order.total_amount} HTG.`, {
                relatedId: order.id,
                relatedType: 'order'
            });

            // Email Vendeur
            if (owner.email) {
                try {
                    const subject = `🎉 Nouvelle vente sur votre boutique ! (Commande #${order.order_number || order.id})`;
                    const text = `Bonjour ${owner.name},\n\nFélicitations ! Vous venez de recevoir une nouvelle commande d'une valeur de ${order.total_amount} HTG de la part de ${order.user?.name || 'un client'}.\n\nMerci de vous connecter rapidement à votre tableau de bord vendeur pour préparer et expédier cette commande.\n\nL'équipe HTFasil.`;
                    sendEmail(owner.email, subject, text);
                } catch (e) {
                    console.error('Error sending order email to seller:', e);
                }
            }
            
            // WhatsApp Vendeur
            const ownerPhone = owner.whatsapp || owner.phone;
            if (ownerPhone) {
                sendWhatsApp(ownerPhone, `🎉 Félicitations ${owner.name} ! Nouvelle vente de ${order.total_amount} HTG (Commande #${order.order_number || order.id}). Connectez-vous à HTFasil pour la préparer.`);
            }
        }
    } catch (err) {
        console.error('❌ Erreur notification vendeurs:', err);
    }

    // 3. Notification Externe (Client)
    if (order.user) {
        // Email
        if (order.user.email) {
            try {
                const { emailTemplates } = await import('../services/emailService.js');
                const template = emailTemplates.orderConfirmed(order.order_number || order.id, order.total_amount);
                sendEmail(order.user.email, template.subject, template.text);
            } catch (e) {
                console.error('Error sending order confirmation email:', e);
            }
        }

        // WhatsApp
        const phone = order.shipping_address?.phone || order.user.phone || order.user.whatsapp;
        if (phone) {
            const waMessage = `Bonjour ${order.user.name}, votre commande #${order.order_number || order.id} est confirmée. Total: ${order.total_amount} HTG.`;
            sendWhatsApp(phone, waMessage);
        }

        // Persistent In-App Notification (Client)
        await createNotification(order.user_id, 'order', 'Commande confirmée', `Votre commande #${order.order_number || order.id} a été bien reçue et validée.`, {
            relatedId: order.id,
            relatedType: 'order'
        });
    }
}

/**
 * Notifie pour une commande créée (en attente de paiement)
 * @param {object} order - Objet commande
 */
export async function notifyOrderCreated(order) {
    const title = `Commande en attente de paiement #${order.order_number || order.id}`;
    const message = `Nouvelle commande enregistrée. En attente de paiement.`;

    // 1. Admin
    await notifyAllAdmins('info', title, message, {
        relatedId: order.id,
        relatedType: 'order'
    });

    // 2. Client
    if (order.user) {
        await createNotification(order.user_id, 'info', 'Commande enregistrée', `Votre commande #${order.order_number || order.id} est enregistrée. Veuillez procéder au paiement.`, {
            relatedId: order.id,
            relatedType: 'order'
        });
        
        if (order.user.email) {
            try {
                const subject = `Votre commande #${order.order_number || order.id} est en attente de paiement`;
                const text = `Bonjour ${order.user.name},\n\nVotre commande a été bien enregistrée. Veuillez procéder au paiement de ${order.total_amount} HTG pour valider la commande.\n\nMerci,\nL'équipe HTFasil.`;
                sendEmail(order.user.email, subject, text);
            } catch (e) {
                console.error('Error sending order created email:', e);
            }
        }
    }
}

/**
 * Notifie pour un paiement partiel
 * @param {object} order - Objet commande
 * @param {number} amountPaid - Montant payé
 * @param {number} remainingAmount - Reste à payer
 */
export async function notifyPartialPayment(order, amountPaid, remainingAmount) {
    const title = `Paiement partiel reçu #${order.order_number || order.id}`;
    const message = `Paiement de ${amountPaid} HTG reçu. Reste à payer: ${remainingAmount} HTG.`;

    // 1. Admin
    await notifyAllAdmins('info', title, message, {
        relatedId: order.id,
        relatedType: 'order'
    });

    // 2. Vendeurs concernés
    try {
        const orderItems = await OrderItem.findAll({
            where: { order_id: order.id },
            include: [{
                model: Product,
                as: 'product',
                include: [{
                    model: Store,
                    as: 'store',
                    include: [{ model: User, as: 'owner' }]
                }]
            }]
        });

        const storeOwners = orderItems
            .map(item => item.product?.store?.owner)
            .filter((owner, index, self) => owner && self.findIndex(o => o.id === owner.id) === index);

        for (const owner of storeOwners) {
            await createNotification(owner.id, 'info', 'Paiement partiel reçu', `Un paiement partiel a été effectué pour la commande #${order.order_number || order.id}. Ne pas expédier avant le paiement total.`, {
                relatedId: order.id,
                relatedType: 'order'
            });
            if (owner.email) {
                const subject = `Paiement partiel sur commande #${order.order_number || order.id}`;
                const text = `Bonjour,\n\nUn paiement partiel a été reçu pour la commande #${order.order_number || order.id}. Le client doit encore régler ${remainingAmount} HTG dans les prochaines 24h.\n\n⚠️ Veuillez ne pas expédier la commande pour le moment.\n\nL'équipe HTFasil.`;
                sendEmail(owner.email, subject, text);
            }
        }
    } catch (e) {
        console.error('❌ Erreur notification vendeurs paiement partiel:', e);
    }

    // 3. Client
    if (order.user) {
        await createNotification(order.user_id, 'warning', 'Paiement partiel reçu (Action requise)', `Nous avons reçu ${amountPaid} HTG. Il vous reste ${remainingAmount} HTG à payer dans les 24h pour valider la commande #${order.order_number || order.id}.`, {
            relatedId: order.id,
            relatedType: 'order'
        });

        if (order.user.email) {
            try {
                const subject = `Action requise: Finalisez le paiement de votre commande #${order.order_number || order.id}`;
                const text = `Bonjour ${order.user.name},\n\nNous avons bien reçu votre premier versement de ${amountPaid} HTG pour la commande #${order.order_number || order.id}.\n\n⚠️ Important : Vous avez 24 heures pour régler le solde restant de ${remainingAmount} HTG. Si le solde n'est pas réglé, la commande sera annulée et votre versement sera remboursé.\n\nMerci,\nL'équipe HTFasil.`;
                sendEmail(order.user.email, subject, text);
            } catch (e) {
                console.error('Error sending partial payment email:', e);
            }
        }
    }
}

/**
 * Notifie pour une annulation (remboursement en attente) après 24h
 * @param {object} order - Objet commande
 * @param {number} refundedAmount - Montant à rembourser
 */
export async function notifyOrderCancelledRefundPending(order, refundedAmount) {
    const title = `Commande annulée (Remboursement en attente) #${order.order_number || order.id}`;
    const message = `Délai de 24h expiré. Montant à rembourser: ${refundedAmount} HTG.`;

    // 1. Admin
    await notifyAllAdmins('warning', title, message, {
        relatedId: order.id,
        relatedType: 'order'
    });

    // 2. Vendeurs concernés
    try {
        const orderItems = await OrderItem.findAll({
            where: { order_id: order.id },
            include: [{
                model: Product,
                as: 'product',
                include: [{
                    model: Store,
                    as: 'store',
                    include: [{ model: User, as: 'owner' }]
                }]
            }]
        });

        const storeOwners = orderItems
            .map(item => item.product?.store?.owner)
            .filter((owner, index, self) => owner && self.findIndex(o => o.id === owner.id) === index);

        for (const owner of storeOwners) {
            await createNotification(owner.id, 'warning', 'Commande annulée (Délai expiré)', `Le client n'a pas finalisé le paiement dans les 24h pour la commande #${order.order_number || order.id}. La commande est annulée.`, {
                relatedId: order.id,
                relatedType: 'order'
            });
            if (owner.email) {
                const subject = `Commande annulée #${order.order_number || order.id}`;
                const text = `Bonjour,\n\nLa commande #${order.order_number || order.id} a été annulée car le solde n'a pas été réglé dans les 24 heures.\n\nL'équipe HTFasil.`;
                sendEmail(owner.email, subject, text);
            }
        }
    } catch (e) {
        console.error('❌ Erreur notification vendeurs annulation délai:', e);
    }

    // 3. Client
    if (order.user) {
        await createNotification(order.user_id, 'error', 'Commande annulée', `Le délai de 24h est expiré. Votre commande #${order.order_number || order.id} est annulée et le remboursement de ${refundedAmount} HTG est en attente.`, {
            relatedId: order.id,
            relatedType: 'order'
        });

        if (order.user.email) {
            try {
                const subject = `Commande annulée - Délai expiré #${order.order_number || order.id}`;
                const text = `Bonjour ${order.user.name},\n\nNous vous informons que votre commande #${order.order_number || order.id} a été annulée car le solde n'a pas été réglé dans le délai de 24 heures imparti.\n\nUn remboursement de ${refundedAmount} HTG est actuellement en attente de traitement.\n\nMerci,\nL'équipe HTFasil.`;
                sendEmail(order.user.email, subject, text);
            } catch (e) {
                console.error('Error sending cancelled refund pending email:', e);
            }
        }
    }
}

/**
 * Notifie pour un changement de statut de commande
 * @param {object} order - Objet commande
 * @param {string} oldStatus - Ancien statut
 * @param {string} newStatus - Nouveau statut
 * @returns {Promise<number>}
 */
export async function notifyOrderStatusChange(order, oldStatus, newStatus) {
    const statusLabels = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        processing: 'En traitement',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée'
    };

    const title = `Commande #${order.order_number || order.id} - ${statusLabels[newStatus]}`;
    const message = `Statut changé de "${statusLabels[oldStatus]}" à "${statusLabels[newStatus]}"`;

    const type = newStatus === 'cancelled' ? 'warning' : 'info';

    // 1. Notification Interne (Admin)
    await notifyAllAdmins(type, title, message, {
        relatedId: order.id,
        relatedType: 'order',
        metadata: {
            orderId: order.id,
            oldStatus,
            newStatus
        }
    });

    // 2. Notification Externe (Client) - Seulement si "delivered", "shipped", ou "cancelled"
    const importantStatuses = ['delivered', 'shipped', 'cancelled'];
    if (importantStatuses.includes(newStatus) && order.user) {
        // Email
        if (order.user.email) {
            try {
                const { emailTemplates } = await import('../services/emailService.js');
                const template = emailTemplates.orderStatusUpdate(order.order_number || order.id, statusLabels[newStatus] || newStatus);
                sendEmail(order.user.email, template.subject, template.text);
            } catch (e) {
                console.error('Error sending order status update email:', e);
            }
        }

        // WhatsApp
        const phone = order.shipping_address?.phone || order.user.phone || order.user.whatsapp;
        if (phone) {
            const waMessage = `Bonjour ${order.user.name}, votre commande #${order.order_number || order.id} a été ${statusLabels[newStatus].toLowerCase()} ! 🎁 Merci !`;
            sendWhatsApp(phone, waMessage);
        }
    }

    // 3. Persistent In-App Notification (Client) - Pour tout changement important
    if (order.user_id) {
        await createNotification(order.user_id, type === 'warning' ? 'warning' : 'order', title, message, {
            relatedId: order.id,
            relatedType: 'order'
        });
    }

    return 1;
}

/**
 * Notifie pour un nouvel utilisateur système
 * @param {object} user - Objet utilisateur
 * @returns {Promise<number>}
 */
export async function notifyNewSystemUser(user) {
    const title = `Nouvel utilisateur système créé`;
    const message = `${user.name} (${user.email}) - Rôle: ${user.role}`;

    return await notifyAllAdmins('info', title, message, {
        relatedId: user.id,
        relatedType: 'user',
        metadata: {
            userId: user.id,
            userRole: user.role,
            userEmail: user.email
        }
    });
}

/**
 * Notifie pour un stock faible
 * @param {object} product - Objet produit
 * @returns {Promise<number>}
 */
export async function notifyLowStock(product) {
    const title = `⚠️ Stock faible: ${product.name}`;
    const message = `Il ne reste que ${product.stock} unité(s) en stock`;

    return await notifyAllAdmins('warning', title, message, {
        relatedId: product.id,
        relatedType: 'product',
        metadata: {
            productId: product.id,
            productName: product.name,
            stock: product.stock
        }
    });
}

/**
 * Notifie pour une nouvelle candidature vendeur
 * @param {object} store - Objet store (candidature)
 * @param {object} user - Objet utilisateur qui a soumis la candidature
 * @returns {Promise<number>}
 */
export async function notifyNewVendorApplication(store, user) {
    const title = `🏪 Nouvelle candidature vendeur`;
    const message = `${user.name} souhaite ouvrir une boutique "${store.name}"`;

    return await notifyAllAdmins('vendor_application', title, message, {
        relatedId: store.id,
        relatedType: 'store',
        metadata: {
            storeId: store.id,
            storeName: store.name,
            userId: user.id,
            userName: user.name,
            userEmail: user.email
        }
    });
}

/**
 * Notifie pour un nouveau litige
 * @param {object} dispute - Objet litige
 */
export async function notifyNewDispute(dispute) {
    try {
        // 1. Trouver les vendeurs concernés par la commande
        const orderItems = await OrderItem.findAll({
            where: { order_id: dispute.order_id },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['storeId'],
                include: [{
                    model: Store,
                    as: 'store',
                    include: [{ model: User, as: 'owner', attributes: ['id'] }]
                }]
            }]
        });

        const storeOwners = orderItems
            .map(item => item.product?.store?.owner)
            .filter((owner, index, self) => owner && self.findIndex(o => o.id === owner.id) === index);

        for (const owner of storeOwners) {
            await createNotification(owner.id, 'warning', 'Nouveau litige ouvert', `Un litige a été ouvert pour la commande #${dispute.order_id}`, {
                relatedId: dispute.id,
                relatedType: 'dispute'
            });
        }

        // 2. Notifier les admins
        await notifyAllAdmins('info', `Nouveau litige #${dispute.id}`, `Un litige a été ouvert pour la commande #${dispute.order_id}`, {
            relatedId: dispute.id,
            relatedType: 'dispute'
        });
    } catch (error) {
        console.error('❌ Erreur notification nouveau litige:', error);
    }
}

/**
 * Notifie pour un nouveau message dans un litige
 * @param {object} dispute - Objet litige
 * @param {object} message - Objet message
 */
export async function notifyNewDisputeMessage(dispute, message) {
    try {
        const isCustomer = message.sender_id === dispute.user_id;

        if (isCustomer) {
            // Client a écrit -> Notifier Vendeur (si pas déjà fait par l'admin) + Admin
            const orderItems = await OrderItem.findAll({
                where: { order_id: dispute.order_id },
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['storeId'],
                    include: [{
                        model: Store,
                        as: 'store',
                        include: [{ model: User, as: 'owner', attributes: ['id'] }]
                    }]
                }]
            });

            const storeOwners = orderItems
                .map(item => item.product?.store?.owner)
                .filter((owner, index, self) => owner && self.findIndex(o => o.id === owner.id) === index);

            for (const owner of storeOwners) {
                await createNotification(owner.id, 'info', 'Message Client (Litige)', `Nouveau message pour le litige #${dispute.id}`, {
                    relatedId: dispute.id,
                    relatedType: 'dispute'
                });
            }

            await notifyAllAdmins('info', `Nouveau message litige #${dispute.id}`, `Le client a envoyé un message pour le litige #${dispute.id}`, {
                relatedId: dispute.id,
                relatedType: 'dispute'
            });
        } else {
            // Admin ou Vendeur a écrit -> Notifier Client
            await createNotification(dispute.user_id, 'info', 'Réponse à votre litige', `Une réponse a été apportée à votre litige #${dispute.id}`, {
                relatedId: dispute.id,
                relatedType: 'dispute'
            });
        }
    } catch (error) {
        console.error('❌ Erreur notification message litige:', error);
    }
}

/**
 * Vérifie les litiges sans réponse du vendeur depuis 24h
 */
export async function checkStaleDisputes() {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Trouver les litiges ouverts il y a plus de 24h
        const oldDisputes = await Dispute.findAll({
            where: {
                status: { [Op.in]: ['pending', 'under_review'] },
                created_at: { [Op.lt]: twentyFourHoursAgo }
            },
            include: [
                {
                    model: DisputeMessage,
                    as: 'messages',
                    separate: true,
                    order: [['created_at', 'DESC']],
                    limit: 1
                }
            ]
        });

        for (const dispute of oldDisputes) {
            const lastMessage = dispute.messages[0];

            // On alerte si :
            // 1. Pas de message du tout (le litige a > 24h)
            // 2. Le dernier message vient du client et il a > 24h
            let shouldAlert = false;

            if (!lastMessage) {
                shouldAlert = true;
            } else if (lastMessage.sender_id === dispute.user_id) {
                const lastMsgDate = new Date(lastMessage.created_at);
                if (lastMsgDate < twentyFourHoursAgo) {
                    shouldAlert = true;
                }
            }

            if (shouldAlert) {
                await notifyAllAdmins('error', `⚠️ Litige sans réponse : #${dispute.id}`, `Le vendeur n'a pas répondu au litige #${dispute.id} depuis plus de 24h.`, {
                    relatedId: dispute.id,
                    relatedType: 'dispute'
                });
            }
        }
    } catch (error) {
        console.error('❌ Erreur vérification litiges stagnants:', error);
    }
}
