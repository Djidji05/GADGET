import express from 'express';
import { Product, Promotion } from '../models/index.js';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve('debug_cart.log');
const log = (msg) => {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) { }
};

const router = express.Router();

// Stockage temporaire en mémoire (pour test)
const tempCarts = new Map(); // sessionId -> cart data

// Helper pour obtenir ou créer un panier
const getOrCreateCart = (identifier) => {
  let cart = tempCarts.get(identifier);
  if (!cart) {
    cart = {
      id: Date.now(),
      customerId: identifier, // Utilisé comme ID unique
      items: [],
      totalAmount: 0,
      discount: 0,
      promoCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tempCarts.set(identifier, cart);
  }
  return cart;
};

// Obtenir le panier (publique)
router.get('/', async (req, res) => {
  try {
    // Utiliser un identifiant de session ou IP
    const identifier = req.ip || req.sessionID || 'anonymous';
    const cart = getOrCreateCart(identifier);
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
  }
});

// Ajouter un produit au panier (publique)
router.post('/add', async (req, res) => {
  try {
    const { productId: rawProductId, quantity = 1 } = req.body;
    const productId = Number(rawProductId);
    log(`POST /add - productId: ${productId}, quantity: ${quantity}`);

    // Vérifier que le produit existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Utiliser un identifiant de session ou IP
    const identifier = req.ip || req.sessionID || 'anonymous';
    const cart = getOrCreateCart(identifier);

    // Vérifier si le produit est déjà dans le panier
    let cartItem = cart.items.find(item => Number(item.productId) === productId);

    if (cartItem) {
      // Mettre à jour la quantité
      const newQuantity = cartItem.quantity + quantity;
      cartItem.quantity = newQuantity;
      cartItem.subtotal = Number(newQuantity) * Number(product.price);
    } else {
      // Ajouter le produit au panier
      cartItem = {
        id: Date.now(),
        productId,
        quantity,
        unitPrice: product.price,
        subtotal: quantity * product.price,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image_url || (product.images && product.images.length > 0 ? product.images[0] : null)
        }
      };
      cart.items.push(cartItem);
    }

    // Recalculer le total
    const subtotal = cart.items.reduce((total, item) => total + Number(item.subtotal), 0);
    cart.totalAmount = Math.max(0, subtotal - (cart.discount || 0));
    cart.updatedAt = new Date().toISOString();

    res.json(cart);
  } catch (error) {
    log(`Add to cart ERROR: ${error.message}`);
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
  }
});

// Mettre à jour la quantité d'un article (publique)
router.put('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'La quantité doit être supérieure à 0' });
    }

    const identifier = req.ip || req.sessionID || 'anonymous';
    const cart = getOrCreateCart(identifier);

    const cartItem = cart.items.find(item => item.id === parseInt(itemId));
    if (!cartItem) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }


    // Obtenir le produit pour le prix
    const product = await Product.findByPk(cartItem.productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    cartItem.quantity = Number(quantity);
    cartItem.subtotal = Number(quantity) * Number(product.price);

    // Recalculer le total
    const subtotalCalc = cart.items.reduce((total, item) => total + Number(item.subtotal), 0);
    cart.totalAmount = Math.max(0, subtotalCalc - (cart.discount || 0));
    cart.updatedAt = new Date().toISOString();

    res.json(cart);
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité' });
  }
});

// Supprimer un article du panier (publique)
router.delete('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const identifier = req.ip || req.sessionID || 'anonymous';
    const cart = getOrCreateCart(identifier);

    const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    cart.items.splice(itemIndex, 1);

    // Recalculer le total
    const subtotalCalc = cart.items.reduce((total, item) => total + Number(item.subtotal), 0);
    cart.totalAmount = Math.max(0, subtotalCalc - (cart.discount || 0));
    cart.updatedAt = new Date().toISOString();

    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
  }
});

// Vider le panier (publique)
router.delete('/clear', async (req, res) => {
  try {
    const identifier = req.ip || req.sessionID || 'anonymous';
    tempCarts.delete(identifier);

    res.json({ message: 'Panier vidé avec succès' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Erreur lors du vidage du panier' });
  }
});

// Appliquer un code promo (publique)
router.post('/promo', async (req, res) => {
  try {
    const { code } = req.body;

    const identifier = req.ip || req.sessionID || 'anonymous';
    const cart = getOrCreateCart(identifier);

    if (!code) {
      cart.discount = 0;
      cart.promoCode = null;
      const subtotalCalc = cart.items.reduce((total, item) => total + Number(item.subtotal), 0);
      cart.totalAmount = subtotalCalc;
      return res.json(cart);
    }

    // Chercher la promotion active
    const promotion = await Promotion.findOne({
      where: { code, isActive: true }
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Code promo invalide ou expiré' });
    }

    const currentDate = new Date();
    if (promotion.startDate && new Date(promotion.startDate) > currentDate) {
      return res.status(400).json({ message: 'Ce code promo n\'est pas encore actif' });
    }
    if (promotion.endDate && new Date(promotion.endDate) < currentDate) {
      return res.status(400).json({ message: 'Ce code promo est expiré' });
    }

    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return res.status(400).json({ message: 'Limite d\'utilisation atteinte pour ce code promo' });
    }

    const subtotal = cart.items.reduce((total, item) => total + Number(item.subtotal), 0);

    if (promotion.minAmount && subtotal < Number(promotion.minAmount)) {
      return res.status(400).json({ message: `Le montant minimum pour utiliser ce code est de ${promotion.minAmount} HTG` });
    }

    let discountAmount = 0;
    if (promotion.discountType === 'percentage') {
      discountAmount = subtotal * (Number(promotion.discount) / 100);
    } else {
      discountAmount = Number(promotion.discount);
    }

    cart.discount = discountAmount;
    cart.promoCode = code;
    cart.totalAmount = Math.max(0, subtotal - discountAmount);

    res.json(cart);
  } catch (error) {
    console.error('Apply promo error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'application du code promo' });
  }
});

// === ROUTES PROTÉGÉES (nécessitent authentification) ===



export default router;
