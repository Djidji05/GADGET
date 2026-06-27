import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Order, Setting } from '../models/index.js';

dotenv.config();

// Cache stripe instances by key to avoid re-instantiating on every request
const stripeInstances = {};

async function getStripeKey() {
  let secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_gadgetzone';
  try {
    const keySetting = await Setting.findOne({ where: { category: 'payment', key: 'stripe_secret_key' } });
    if (keySetting && keySetting.value) {
      secretKey = keySetting.value;
    }
  } catch (err) {
    console.warn('Could not load stripe_secret_key from DB settings:', err.message);
  }
  return secretKey;
}

async function getStripeInstance() {
  const secretKey = await getStripeKey();
  if (!stripeInstances[secretKey]) {
    stripeInstances[secretKey] = new Stripe(secretKey);
  }
  return stripeInstances[secretKey];
}

const stripeService = {
  /**
   * Crée une session de paiement Stripe Checkout à partir d'un montant en Gourdes (HTG)
   * converti en Dollars (USD) en utilisant le taux de change spécifié.
   * 
   * @param {string|number} orderId - ID de la commande
   * @param {number} amountHTG - Montant en Gourdes
   * @param {number} exchangeRate - Taux de change (ex: 135)
   * @param {string} returnUrl - URL de retour après paiement
   * @returns {Promise<{redirectUrl: string, token: string}>}
   */
  createPayment: async (orderId, amountHTG, exchangeRate, returnUrl = null) => {
    try {
      // 1. Récupérer l'email de l'utilisateur pour pré-remplir le formulaire Stripe Checkout
      let customerEmail = 'client@htfasil.com';
      if (!String(orderId).startsWith('BOOST_') && !String(orderId).startsWith('QR_')) {
        try {
          const order = await Order.findByPk(orderId, { include: ['user'] });
          if (order && order.user && order.user.email) {
            customerEmail = order.user.email;
          }
        } catch (e) {
          console.warn('Could not fetch user email for Stripe Checkout Session:', e.message);
        }
      }

      // 2. Calculer le montant converti en USD (en centimes de dollar)
      const exchangeRateNum = Number(exchangeRate) || 135;
      const amountUSD = Number(amountHTG) / exchangeRateNum;
      const amountInCentimes = Math.max(50, Math.round(amountUSD * 100)); // Minimum Stripe est de 0.50 USD (50 centimes)

      // 3. Définir les URLs de succès et d'annulation
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const successUrl = returnUrl || `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${frontendUrl}/payment/cancelled`;

      // 4. Détecter si la clé Stripe est un placeholder (ou absente) pour basculer en mode Mock
      const secretKey = await getStripeKey();
      if (!secretKey || secretKey.includes('placeholder') || secretKey.trim() === '') {
        const mockSessionId = `cs_mock_${orderId}_${Math.random().toString(36).substring(2, 9)}`;
        const finalSuccessUrl = successUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId);
        console.log(`[Stripe MOCK] Détecté clé placeholder. Redirection simulée vers : ${finalSuccessUrl}`);
        return {
          redirectUrl: finalSuccessUrl,
          token: mockSessionId
        };
      }

      console.log(`Creating Stripe Checkout Session for order ${orderId}: ${amountHTG} HTG -> ${amountUSD.toFixed(2)} USD (Taux: ${exchangeRateNum})`);

      // 5. Créer la session Stripe Checkout réelle
      const stripe = await getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: String(orderId).startsWith('BOOST_') 
                  ? `Parrainage / Boost de Produit` 
                  : String(orderId).startsWith('QR_')
                  ? `Paiement Direct QR Code`
                  : `Commande #${orderId} - GadgetZone`,
                description: `Paiement sécurisé par carte bancaire. Montant original : ${amountHTG} HTG (Taux de change appliqué : 1 USD = ${exchangeRateNum} HTG)`,
              },
              unit_amount: amountInCentimes,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        metadata: {
          orderId: String(orderId),
          amountHTG: String(amountHTG),
          exchangeRate: String(exchangeRateNum),
          amountUSD: (amountInCentimes / 100).toFixed(2)
        }
      });

      return {
        redirectUrl: session.url,
        token: session.id // L'ID de session Checkout sert de token de paiement temporaire
      };
    } catch (error) {
      console.error('Stripe createPayment session error:', error.message);
      throw new Error(`Stripe session creation failed: ${error.message}`);
    }
  },

  /**
   * Récupère les détails d'une session Stripe Checkout (supporte le mode réel et mock)
   * 
   * @param {string} sessionId - ID de session Stripe Checkout
   * @returns {Promise<object|null>}
   */
  retrieveSession: async (sessionId) => {
    try {
      if (sessionId && sessionId.startsWith('cs_mock_')) {
        const parts = sessionId.split('_');
        const orderId = parts[2];
        return {
          status: 'successful',
          amount_total: 10.00,
          currency: 'usd',
          payment_intent: `pi_mock_${parts[3] || 'intent'}`,
          orderId: orderId,
          amountHTG: '0',
          exchangeRate: '135'
        };
      }

      const stripe = await getStripeInstance();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session) {
        return {
          status: session.payment_status === 'paid' ? 'successful' : 'pending',
          amount_total: session.amount_total ? (session.amount_total / 100) : 0,
          currency: session.currency,
          payment_intent: session.payment_intent,
          orderId: session.metadata?.orderId,
          amountHTG: session.metadata?.amountHTG,
          exchangeRate: session.metadata?.exchangeRate
        };
      }
      return null;
    } catch (error) {
      console.error(`Stripe retrieveSession error for ${sessionId}:`, error.message);
      return null;
    }
  }
};

export default stripeService;
