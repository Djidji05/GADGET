import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { Order, OrderTracking, Store, User } from '../models/index.js';
import { sendToUser } from '../utils/sseManager.js';

const router = express.Router();

/**
 * GET /api/tracking/:orderId
 * Obtenir l'historique complet de suivi (timeline) et coordonnées de livraison
 */
router.get('/:orderId', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId, {
            include: [{ model: Store, as: 'store' }]
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        // Vérification des droits d'accès
        const isAdmin = req.user.role === 'admin';
        const isCustomer = order.user_id === req.user.id;
        const isSeller = order.store && order.store.userId === req.user.id;

        if (!isAdmin && !isCustomer && !isSeller) {
            return res.status(403).json({ error: 'Accès non autorisé à cette commande' });
        }

        const trackings = await OrderTracking.findAll({
            where: { order_id: orderId },
            order: [['created_at', 'ASC']]
        });

        res.json({
            order: {
                id: order.id,
                status: order.status,
                carrier_name: order.carrier_name,
                tracking_number: order.tracking_number,
                shipping_coordinates: order.shipping_coordinates
            },
            trackings
        });
    } catch (error) {
        console.error('❌ GET /tracking/:orderId:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/tracking/:orderId/update
 * Ajouter une étape de livraison (vendeur / admin)
 */
router.post('/:orderId/update', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, description, location } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Le statut est obligatoire' });
        }

        const order = await Order.findByPk(orderId, {
            include: [{ model: Store, as: 'store' }]
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        // Vérification des droits
        const isAdmin = req.user.role === 'admin';
        const isSeller = order.store && order.store.userId === req.user.id;

        if (!isAdmin && !isSeller) {
            return res.status(403).json({ error: 'Accès interdit. Seul le vendeur ou l\'administrateur peut modifier le suivi.' });
        }

        // Créer l'étape de suivi
        const tracking = await OrderTracking.create({
            order_id: orderId,
            status,
            description,
            location
        });

        // Synchroniser le statut de la commande si valide
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (validStatuses.includes(status)) {
            order.status = status;
            if (status === 'shipped') {
                order.shipped_at = new Date();
            } else if (status === 'delivered') {
                order.delivered_at = new Date();
            } else if (status === 'confirmed') {
                order.confirmed_at = new Date();
            } else if (status === 'cancelled') {
                order.cancelled_at = new Date();
            }
            await order.save();
        }

        // Envoyer la notification temps réel via SSE
        sendToUser(order.user_id, 'tracking_event', {
            order_id: orderId,
            status,
            description,
            location,
            created_at: tracking.created_at
        });

        res.json({ message: 'Suivi de commande mis à jour', tracking });
    } catch (error) {
        console.error('❌ POST /tracking/:orderId/update:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/tracking/:orderId/location
 * Mettre à jour les coordonnées GPS du livreur en temps réel
 */
router.post('/:orderId/location', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { latitude, longitude, carrier_phone } = req.body;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Les coordonnées GPS (latitude, longitude) sont obligatoires' });
        }

        const order = await Order.findByPk(orderId, {
            include: [{ model: Store, as: 'store' }]
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        // Vérification des droits (Admin, vendeur ou livreur)
        const isAdmin = req.user.role === 'admin';
        const isSeller = order.store && order.store.userId === req.user.id;

        if (!isAdmin && !isSeller && req.user.role !== 'delivery' && req.user.role !== 'vendor') {
            return res.status(403).json({ error: 'Non autorisé à mettre à jour la localisation GPS' });
        }

        // Trouver la dernière étape de suivi pour y ajouter la position actuelle
        let tracking = await OrderTracking.findOne({
            where: { order_id: orderId },
            order: [['created_at', 'DESC']]
        });

        if (tracking) {
            tracking.latitude = parseFloat(latitude);
            tracking.longitude = parseFloat(longitude);
            if (carrier_phone) {
                tracking.carrier_phone = carrier_phone;
            }
            await tracking.save();
        } else {
            tracking = await OrderTracking.create({
                order_id: orderId,
                status: 'in_transit',
                description: 'Dernière localisation connue du livreur',
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                carrier_phone
            });
        }

        // Pousser la position en direct au client via SSE
        sendToUser(order.user_id, 'tracking_location', {
            order_id: orderId,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            carrier_phone: carrier_phone || tracking.carrier_phone,
            updated_at: new Date().toISOString()
        });

        res.json({ message: 'Position GPS mise à jour avec succès', tracking });
    } catch (error) {
        console.error('❌ POST /tracking/:orderId/location:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
