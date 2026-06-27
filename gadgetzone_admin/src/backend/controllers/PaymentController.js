import PaymentService from '../services/PaymentService.js';
import crypto from 'crypto';

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    initMonCash = async (req, res) => {
        try {
            const { orderId, amount, returnUrl } = req.body;
            if (!orderId || amount === undefined || amount === null) {
                return res.status(400).json({ error: 'OrderId and amount are required' });
            }

            if (Number(amount) <= 0) {
                // Validation immédiate pour les commandes gratuites
                const { Order } = await import('../models/index.js');
                const targetOrder = await Order.findByPk(orderId);
                if (targetOrder) {
                    const orderGroup = await Order.findAll({
                        where: targetOrder.payment_group_id ? { payment_group_id: targetOrder.payment_group_id } : { id: targetOrder.id },
                        include: ['items']
                    });
                    const { sequelize } = await import('../models/index.js');
                    await sequelize.transaction(async (t) => {
                        for (const o of orderGroup) {
                            await this.paymentService.finalizePayment(o, 'FREE_ORDER', t);
                        }
                    });
                }
                return res.json({ redirectUrl: null });
            }

            const userId = req.user?.id; // Récupéré via authenticateToken
            
            // === LOGIQUE DE FRACTIONNEMENT MONCASH ===
            let finalAmount = Number(amount);
            const isBoost = String(orderId).startsWith('BOOST_');
            const isQR = String(orderId).startsWith('QR_');

            if (!isBoost && !isQR) {
                const { Order } = await import('../models/index.js');
                const order = await Order.findByPk(orderId);
                if (order) {
                    const totalPaid = Number(order.total_paid || 0);
                    const totalAmount = Number(order.total_amount);
                    const remaining = totalAmount - totalPaid;
                    
                    if (finalAmount > remaining && remaining > 0) {
                        finalAmount = remaining;
                    }
                    
                    // Si la commande est nouvelle, on met son statut en partially_paid si elle dépasse 100k
                    if (totalAmount > 100000 && order.status === 'pending') {
                        await order.update({ status: 'partially_paid' });
                    }
                }
            }

            // Plafond strict MonCash
            if (finalAmount > 100000) {
                finalAmount = 100000;
            }

            const redirectUrl = await this.paymentService.initiateMonCashPayment(orderId, finalAmount, userId, returnUrl);
            res.json({ redirectUrl, amountProcessed: finalAmount });
        } catch (error) {
            console.error('❌ Controller Error [initMonCash]:', error);
            res.status(500).json({ error: error.message });
        }
    };

    initStripe = async (req, res) => {
        try {
            const { orderId, amount, returnUrl } = req.body;
            if (!orderId || amount === undefined || amount === null) {
                return res.status(400).json({ error: 'OrderId and amount are required' });
            }

            const userId = req.user?.id; // Récupéré via authenticateToken
            const redirectUrl = await this.paymentService.initiateStripePayment(orderId, amount, userId, returnUrl);
            res.json({ redirectUrl });
        } catch (error) {
            console.error('❌ Controller Error [initStripe]:', error);
            res.status(500).json({ error: error.message });
        }
    };

    handleMonCashWebhook = async (req, res) => {
        try {
            // 🛡️ SÉCURITÉ : Vérification de signature HMAC-SHA256 (Recommandé par Starbee)
            const webhookSecret = process.env.STARBEE_WEBHOOK_SECRET;
            const signature = req.headers['x-starbee-signature'] || req.headers['signature'] || req.headers['x-webhook-signature'];

            if (webhookSecret && webhookSecret !== 'COLLEZ_LE_SECRET_DU_WEBHOOK_ICI' && signature) {
                // Le payload doit souvent être un string pour le HMAC
                const payload = JSON.stringify(req.body);
                const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
                
                if (signature !== expectedSignature) {
                    console.warn(`🛑 Invalid Starbee Webhook Signature from IP: ${req.ip}`);
                    return res.status(403).json({ error: 'Forbidden: Invalid HMAC signature' });
                }
            } else {
                // Fallback (Ancienne méthode Digicel si le paramètre secret est présent dans l'URL)
                const legacySecret = req.query.secret;
                const EXPECTED_LEGACY = 'GADGET_X_MONCASH_SECURE'; 
                
                if (legacySecret && legacySecret !== EXPECTED_LEGACY) {
                    console.warn(`🛑 Unauthorized Legacy Webhook Attempt from IP: ${req.ip}`);
                    return res.status(403).json({ error: 'Forbidden: Invalid legacy secret' });
                }
            }

            // MonCash sends payload in body
            const success = await this.paymentService.processMonCashWebhook(req.body);
            if (success) {
                res.sendStatus(200);
            } else {
                res.status(400).send('Verification failed');
            }
        } catch (error) {
            console.error('❌ Controller Error [handleMonCashWebhook]:', error);
            res.status(500).json({ error: error.message });
        }
    };

    handleStripeWebhook = async (req, res) => {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) {
                return res.status(400).send('Webhook Error: Missing stripe-signature header');
            }

            const { Setting } = await import('../models/index.js');
            const keySetting = await Setting.findOne({ where: { category: 'payment', key: 'stripe_secret_key' } });
            const secretKey = (keySetting && keySetting.value) || process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_gadgetzone';

            const webhookSetting = await Setting.findOne({ where: { category: 'payment', key: 'stripe_webhook_secret' } });
            const webhookSecret = (webhookSetting && webhookSetting.value) || process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder_webhook_secret';

            const { default: Stripe } = await import('stripe');
            const stripe = new Stripe(secretKey);

            let event;
            try {
                // Utiliser req.rawBody pour la vérification de signature Stripe
                event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, webhookSecret);
            } catch (err) {
                console.error('❌ Stripe Webhook Signature Verification Failed:', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            console.log(`🔔 Stripe Webhook Event Received: ${event.type}`);

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const orderId = session.metadata?.orderId;
                const transactionId = session.payment_intent || session.id;

                if (orderId) {
                    const isBoost = String(orderId).startsWith('BOOST_');
                    const isQR = String(orderId).startsWith('QR_');

                    if (isBoost) {
                        const boostId = orderId.replace('BOOST_', '');
                        await this.paymentService.finalizeBoostPayment(boostId, transactionId);
                    } else if (isQR) {
                        const { QRPayment, Wallet, Store } = await import('../models/index.js');
                        const ref = orderId.replace(/^QR_/, '');
                        const qrPayment = await QRPayment.findOne({ where: { ref } });
                        if (qrPayment && qrPayment.status !== 'paid') {
                            qrPayment.status = 'paid';
                            qrPayment.transaction_id = transactionId;
                            await qrPayment.save();
                            const store = await Store.findByPk(qrPayment.store_id);
                            if (store) {
                                const [wallet] = await Wallet.findOrCreate({
                                    where: { storeId: qrPayment.store_id },
                                    defaults: { available_balance: 0, pending_balance: 0 }
                                });
                                wallet.available_balance = Number(wallet.available_balance) + Number(qrPayment.amount);
                                wallet.total_earned = Number(wallet.total_earned) + Number(qrPayment.amount);
                                await wallet.save();
                            }
                        }
                    } else {
                        const { Order } = await import('../models/index.js');
                        const targetOrder = await Order.findByPk(orderId);
                        if (targetOrder) {
                            const orderGroup = await Order.findAll({
                                where: targetOrder.payment_group_id ? { payment_group_id: targetOrder.payment_group_id } : { id: targetOrder.id },
                                include: ['items']
                            });

                            const { sequelize } = await import('../models/index.js');
                            await sequelize.transaction(async (t) => {
                                for (const o of orderGroup) {
                                    await this.paymentService.finalizePayment(o, transactionId, 'Stripe', t);
                                }
                            });
                        }
                    }
                }
            }

            res.json({ received: true });
        } catch (error) {
            console.error('❌ Controller Error [handleStripeWebhook]:', error);
            res.status(500).json({ error: error.message });
        }
    };

    verifyCallbackPayment = async (req, res) => {
        try {
            const transactionId = req.query.transaction_id;
            if (!transactionId) {
                return res.status(400).json({ error: 'Missing transaction_id' });
            }

            const result = await this.paymentService.verifyPaymentByTransactionId(transactionId);
            
            if (result && result.success) {
                res.json({ success: true, orderId: result.orderId });
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            console.error('❌ Controller Error [verifyCallbackPayment]:', error);
            res.status(500).json({ error: error.message });
        }
    };

    verifyPayment = async (req, res) => {
        try {
            const success = await this.paymentService.verifyPaymentStatic(req.params.orderId);
            res.json({ success });
        } catch (error) {
            console.error('❌ Controller Error [verifyPayment]:', error);
            res.status(500).json({ error: error.message });
        }
    };

    // Stats and List delegates (Mocked or using repository)
    getStats = async (req, res) => {
        // Rediriger vers un service de stats global ou implémenter ici
        res.status(501).json({ message: 'Use integrated Stats API' });
    };
}

export default new PaymentController();
