import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, checkStoreActive } from '../middleware/auth.js';
import deliveryController from '../controllers/DeliveryController.js';
import { Order, OrderItem, Product } from '../models/index.js';
import OrderService from '../services/OrderService.js';

const router = express.Router();
const orderService = new OrderService();

/**
 * POST /api/delivery/runner-verify
 * Valider le jeton de session du livreur (JWT) et le code de livraison de la commande (OTP/QR),
 * puis marquer la commande comme livrée si elle appartient à la boutique du vendeur.
 * Cette route est publique (elle utilise le jeton de session JWT comme authentification).
 */
router.post('/runner-verify', async (req, res) => {
    try {
        const { sessionToken, deliveryToken } = req.body;

        if (!sessionToken || !deliveryToken) {
            return res.status(400).json({ error: 'Session token and Delivery token are required.' });
        }

        // 1. Vérifier la validité du jeton du livreur (JWT)
        let decoded;
        try {
            decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
        } catch (jwtError) {
            return res.status(401).json({ error: 'Session de livraison expirée ou invalide. Veuillez demander un nouveau lien de livraison.' });
        }

        if (decoded.type !== 'delivery_runner' || !decoded.storeId) {
            return res.status(401).json({ error: 'Jeton de session de livraison invalide.' });
        }

        const storeId = decoded.storeId;
        const sellerId = decoded.sellerId;

        // 2. Trouver la commande correspondant au deliveryToken scanné
        const order = await Order.findOne({
            where: { delivery_token: deliveryToken.trim().toUpperCase() }
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande introuvable pour ce code de livraison.' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ error: 'Cette commande a déjà été confirmée comme livrée.' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ error: 'Cette commande a été annulée.' });
        }

        // 3. Vérifier que la commande appartient à la boutique du vendeur
        if (order.store_id !== storeId) {
            return res.status(403).json({ error: 'Accès refusé : cette commande n\'appartient pas à la boutique associée à ce lien.' });
        }

        // 4. Valider le scan de livraison via le service de commande existant
        const result = await orderService.verifyDeliveryScan(
            order.id,
            deliveryToken,
            sellerId
        );

        res.json({ success: true, orderId: order.id, result });
    } catch (error) {
        console.error('❌ Error in runner-verify route:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Toutes les routes suivantes nécessitent une authentification
router.use(authenticateToken);

/**
 * POST /api/delivery/verify-scan
 * Valider une livraison via le code QR/Jeton du client.
 * Réservé aux Vendeurs (propriétaires) ou Admins.
 */
router.post('/verify-scan', deliveryController.verifyScan);

/**
 * POST /api/delivery/session
 * Générer un jeton de session de livraison temporaire (JWT valide 12 heures) pour le vendeur.
 */
router.post('/session', checkStoreActive, async (req, res) => {
    try {
        const storeId = req.store.id;
        const sellerId = req.user.id;
        
        const token = jwt.sign(
            { 
                type: 'delivery_runner',
                storeId,
                sellerId,
                storeName: req.store.name
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({ token, storeName: req.store.name, expiresIn: '12h' });
    } catch (error) {
        console.error('❌ Error generating delivery session:', error);
        res.status(500).json({ error: 'Failed to generate delivery session' });
    }
});

export default router;
