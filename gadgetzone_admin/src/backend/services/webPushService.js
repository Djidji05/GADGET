import webpush from 'web-push';
import { PushSubscription, User } from '../models/index.js';

// Les clés VAPID sont générées une fois et stockées dans .env
// Générer avec: npx web-push generate-vapid-keys
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contact@htfasil.com';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
    console.log('✅ Web Push VAPID configured');
} else {
    console.log('ℹ️  Web Push not configured (no VAPID keys)');
}

const webPushService = {
    /**
     * Envoyer une notification push à un utilisateur spécifique
     * @param {number} userId - ID de l'utilisateur
     * @param {string} title - Titre de la notification
     * @param {string} body - Corps du message
     * @param {object} data - Données supplémentaires (url, type, etc.)
     */
    sendToUser: async (userId, title, body, data = {}) => {
        if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;

        try {
            const subscriptions = await PushSubscription.findAll({
                where: { user_id: userId, is_active: true }
            });

            const payload = JSON.stringify({
                title,
                body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                data: {
                    url: data.url || '/',
                    type: data.type || 'general',
                    ...data
                },
                timestamp: Date.now()
            });

            const results = await Promise.allSettled(
                subscriptions.map(sub => 
                    webpush.sendNotification({
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.keys_p256dh,
                            auth: sub.keys_auth
                        }
                    }, payload).catch(async (err) => {
                        // Si le endpoint est invalide (410 Gone), désactiver
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            await sub.update({ is_active: false });
                            console.log(`📱 Push sub ${sub.id} désactivée (endpoint expiré)`);
                        }
                        throw err;
                    })
                )
            );

            const sent = results.filter(r => r.status === 'fulfilled').length;
            console.log(`📱 Push envoyé à user ${userId}: ${sent}/${subscriptions.length} appareils`);
            return sent;
        } catch (error) {
            console.error('❌ Push send error:', error.message);
            return 0;
        }
    },

    /**
     * Envoyer une notification à tous les utilisateurs actifs
     */
    sendToAll: async (title, body, data = {}) => {
        if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;

        try {
            const subscriptions = await PushSubscription.findAll({
                where: { is_active: true }
            });

            const payload = JSON.stringify({
                title,
                body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                data: { url: data.url || '/', ...data },
                timestamp: Date.now()
            });

            let sent = 0;
            for (const sub of subscriptions) {
                try {
                    await webpush.sendNotification({
                        endpoint: sub.endpoint,
                        keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth }
                    }, payload);
                    sent++;
                } catch (err) {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await sub.update({ is_active: false });
                    }
                }
            }

            console.log(`📱 Push broadcast: ${sent}/${subscriptions.length} envoyés`);
            return sent;
        } catch (error) {
            console.error('❌ Push broadcast error:', error.message);
            return 0;
        }
    },

    /**
     * Notifications prédéfinies pour les événements courants
     */
    notifyOrderConfirmed: (userId, orderId) =>
        webPushService.sendToUser(userId, 
            '✅ Commande confirmée !', 
            `Votre commande #${orderId} a été confirmée et est en cours de préparation.`,
            { url: `/orders/${orderId}`, type: 'order' }
        ),

    notifyOrderShipped: (userId, orderId) =>
        webPushService.sendToUser(userId,
            '📦 Commande expédiée !',
            `Votre commande #${orderId} est en route vers vous.`,
            { url: `/orders/${orderId}`, type: 'order' }
        ),

    notifyOrderDelivered: (userId, orderId) =>
        webPushService.sendToUser(userId,
            '🎉 Commande livrée !',
            `Votre commande #${orderId} a été livrée. N'oubliez pas de laisser un avis !`,
            { url: `/orders/${orderId}`, type: 'order' }
        ),

    notifyFlashSale: (title, flashSaleId) =>
        webPushService.sendToAll(
            '⚡ Vente Flash !',
            title,
            { url: `/promotions`, type: 'flash_sale' }
        ),

    notifyPriceDropWishlist: (userId, productName, productId) =>
        webPushService.sendToUser(userId,
            '💰 Baisse de prix !',
            `Le prix de "${productName}" a baissé ! Ne le manquez pas.`,
            { url: `/products/${productId}`, type: 'price_drop' }
        ),

    notifyNewMessage: (userId, senderName) =>
        webPushService.sendToUser(userId,
            `💬 Nouveau message de ${senderName}`,
            'Vous avez reçu un nouveau message.',
            { url: '/seller/messages', type: 'message' }
        ),

    notifyAbandonedCart: (userId, itemCount) =>
        webPushService.sendToUser(userId,
            '🛒 Votre panier vous attend !',
            `Vous avez ${itemCount} article${itemCount > 1 ? 's' : ''} dans votre panier. Finalisez votre commande !`,
            { url: '/cart', type: 'abandoned_cart' }
        ),

    /**
     * Retourne la clé publique VAPID pour le frontend
     */
    getVapidPublicKey: () => VAPID_PUBLIC
};

export default webPushService;
