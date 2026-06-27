import express from 'express';
import { Op } from 'sequelize';
import { authenticateToken, requireAdmin, isSeller, checkStoreActive } from '../middleware/auth.js';
import { FlashSale, Product, Store } from '../models/index.js';

const router = express.Router();

/**
 * GET /api/flash-sales/active — Ventes flash actives (public)
 */
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const sales = await FlashSale.findAll({
            where: {
                status: 'active',
                start_at: { [Op.lte]: now },
                end_at: { [Op.gte]: now }
            },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'image_url', 'price', 'average_rating', 'review_count'],
                include: [{ model: Store, as: 'store', attributes: ['id', 'name', 'logoUrl'] }]
            }],
            order: [['end_at', 'ASC']],
            limit: 20
        });
        res.json({ flash_sales: sales });
    } catch (error) {
        console.error('❌ GET /flash-sales/active:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/flash-sales — Toutes les ventes flash (admin)
 */
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const sales = await FlashSale.findAll({
            include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image_url'] }],
            order: [['start_at', 'DESC']]
        });
        res.json({ flash_sales: sales });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/flash-sales — Créer une vente flash (vendeur ou admin)
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { product_id, flash_price, start_at, end_at, stock_limit } = req.body;
        if (!product_id || !flash_price || !start_at || !end_at) {
            return res.status(400).json({ error: 'Champs requis : product_id, flash_price, start_at, end_at' });
        }

        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

        const original_price = Number(product.price);
        const discount_percentage = Math.round(((original_price - Number(flash_price)) / original_price) * 100);

        if (discount_percentage <= 0) {
            return res.status(400).json({ error: 'Le prix flash doit être inférieur au prix original' });
        }

        // Vérifier que le vendeur possède ce produit
        if (req.user.role === 'seller') {
            const { Store } = await import('../models/index.js');
            const store = await Store.findOne({ where: { userId: req.user.id } });
            if (!store || product.storeId !== store.id) {
                return res.status(403).json({ error: 'Ce produit ne vous appartient pas' });
            }
        }

        const sale = await FlashSale.create({
            product_id,
            store_id: req.user.role === 'seller' ? product.storeId : null,
            original_price,
            flash_price: Number(flash_price),
            discount_percentage,
            start_at: new Date(start_at),
            end_at: new Date(end_at),
            stock_limit: stock_limit || null,
            current_stock: stock_limit || null,
            status: new Date(start_at) <= new Date() ? 'active' : 'scheduled'
        });

        res.status(201).json({ message: 'Vente flash créée', flash_sale: sale });
    } catch (error) {
        console.error('❌ POST /flash-sales:', error.message);
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
});

/**
 * DELETE /api/flash-sales/:id — Annuler une vente flash (admin)
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const sale = await FlashSale.findByPk(req.params.id);
        if (!sale) return res.status(404).json({ error: 'Vente flash non trouvée' });
        await sale.update({ status: 'cancelled' });
        res.json({ message: 'Vente flash annulée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
