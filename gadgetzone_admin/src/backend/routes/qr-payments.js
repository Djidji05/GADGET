import express from 'express';
import { authenticateToken, isSeller, checkStoreActive } from '../middleware/auth.js';
import { QRPayment } from '../models/index.js';

const router = express.Router();

/**
 * POST /api/qr-payments/create
 * Crée une intention de paiement QR (Vendeur uniquement)
 */
router.post('/create', authenticateToken, isSeller, checkStoreActive, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ error: 'Montant invalide', message: 'Veuillez saisir un montant positif.' });
        }

        // Générer un code unique de référence
        const ref = 'QR_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString().slice(-4);

        const qrPayment = await QRPayment.create({
            store_id: req.store.id,
            ref,
            amount: parseFloat(amount),
            status: 'pending'
        });

        res.status(201).json({ success: true, ref, qrPayment });
    } catch (error) {
        console.error('❌ POST /qr-payments/create:', error.message);
        res.status(500).json({ error: 'Erreur serveur lors de la création du QR' });
    }
});

/**
 * GET /api/qr-payments/history
 * Historique des paiements QR d'une boutique (Vendeur uniquement)
 */
router.get('/history', authenticateToken, isSeller, checkStoreActive, async (req, res) => {
    try {
        const payments = await QRPayment.findAll({
            where: { store_id: req.store.id },
            order: [['created_at', 'DESC']],
            limit: 50
        });
        res.json(payments);
    } catch (error) {
        console.error('❌ GET /qr-payments/history:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/qr-payments/:ref
 * Récupère les détails d'un paiement QR par sa référence (Client & Vendeur)
 */
router.get('/:ref', authenticateToken, async (req, res) => {
    try {
        const { ref } = req.params;
        const { Store } = await import('../models/index.js');
        const qrPayment = await QRPayment.findOne({
            where: { ref },
            include: [{ model: Store, as: 'store', attributes: ['name', 'logoUrl'] }]
        });

        if (!qrPayment) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }

        res.json(qrPayment);
    } catch (error) {
        console.error('❌ GET /qr-payments/:ref:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/qr-payments/:ref/pay
 * Client déclenche le paiement d'un QR code via MonCash
 */
router.post('/:ref/pay', authenticateToken, async (req, res) => {
    try {
        const { ref } = req.params;
        const { returnUrl } = req.body;

        const qrPayment = await QRPayment.findOne({ where: { ref } });
        if (!qrPayment) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }

        if (qrPayment.status !== 'pending') {
            return res.status(400).json({ error: 'Paiement déjà traité ou expiré' });
        }

        // Associer l'utilisateur connecté comme payeur
        qrPayment.payer_user_id = req.user.id;
        await qrPayment.save();

        // Initialiser le paiement MonCash (Starbee)
        const PaymentServiceClass = (await import('../services/PaymentService.js')).default;
        const paymentService = new PaymentServiceClass();

        const defaultReturnUrl = returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`;
        const redirectUrl = await paymentService.initiateMonCashPayment(
            `QR_${ref}`,
            qrPayment.amount,
            req.user.id,
            defaultReturnUrl
        );

        res.json({ success: true, redirectUrl });
    } catch (error) {
        console.error('❌ POST /qr-payments/:ref/pay:', error.message);
        res.status(500).json({ error: error.message || 'Erreur serveur lors de l\'initialisation du paiement' });
    }
});

export default router;
