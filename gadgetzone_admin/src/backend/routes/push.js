import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { PushSubscription } from '../models/index.js';
import webPushService from '../services/webPushService.js';

const router = express.Router();

/**
 * GET /api/push/vapid-key — Retourne la clé publique VAPID pour le frontend
 */
router.get('/vapid-key', (req, res) => {
    const key = webPushService.getVapidPublicKey();
    if (!key) {
        return res.status(503).json({ error: 'Push notifications non configurées' });
    }
    res.json({ publicKey: key });
});

/**
 * POST /api/push/subscribe — Enregistre une nouvelle subscription Push
 */
router.post('/subscribe', authenticateToken, async (req, res) => {
    try {
        const { endpoint, keys } = req.body;

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return res.status(400).json({ error: 'Subscription invalide: endpoint et keys requis' });
        }

        // Upsert: si le endpoint existe déjà, mettre à jour
        const [subscription, created] = await PushSubscription.findOrCreate({
            where: { endpoint },
            defaults: {
                user_id: req.user.id,
                keys_p256dh: keys.p256dh,
                keys_auth: keys.auth,
                user_agent: req.headers['user-agent'],
                is_active: true
            }
        });

        if (!created) {
            // Mettre à jour si le endpoint existe déjà (resubscription)
            await subscription.update({
                user_id: req.user.id,
                keys_p256dh: keys.p256dh,
                keys_auth: keys.auth,
                is_active: true
            });
        }

        console.log(`📱 Push ${created ? 'subscribed' : 'updated'}: user ${req.user.id}`);
        res.status(created ? 201 : 200).json({
            message: created ? 'Abonné aux notifications' : 'Subscription mise à jour',
            id: subscription.id
        });
    } catch (error) {
        console.error('❌ Push subscribe error:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/push/unsubscribe — Désactive une subscription
 */
router.post('/unsubscribe', authenticateToken, async (req, res) => {
    try {
        const { endpoint } = req.body;
        if (!endpoint) {
            return res.status(400).json({ error: 'Endpoint requis' });
        }

        const result = await PushSubscription.update(
            { is_active: false },
            { where: { endpoint, user_id: req.user.id } }
        );

        res.json({ message: 'Désabonné des notifications', affected: result[0] });
    } catch (error) {
        console.error('❌ Push unsubscribe error:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/push/test — Envoie une notification test à l'utilisateur connecté (dev only)
 */
router.post('/test', authenticateToken, async (req, res) => {
    try {
        const sent = await webPushService.sendToUser(
            req.user.id,
            '🔔 Test HTFasil',
            'Les notifications push fonctionnent !',
            { url: '/', type: 'test' }
        );
        res.json({ message: `Notification test envoyée à ${sent} appareil(s)` });
    } catch (error) {
        console.error('❌ Push test error:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
