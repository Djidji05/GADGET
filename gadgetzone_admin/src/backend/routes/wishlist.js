import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { Wishlist, Product, Store, Category } from '../models/index.js';

const router = express.Router();

/**
 * GET /api/wishlist — Liste des favoris de l'utilisateur connecté
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const items = await Wishlist.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'image_url', 'price', 'original_price', 'average_rating', 'review_count', 'status'],
                include: [
                    { model: Store, as: 'store', attributes: ['id', 'name', 'logoUrl'] },
                    { model: Category, as: 'category', attributes: ['id', 'name'] }
                ]
            }],
            order: [['created_at', 'DESC']]
        });
        res.json({ wishlist: items, count: items.length });
    } catch (error) {
        console.error('❌ GET /wishlist:', error.message);
        res.status(500).json({ error: 'Erreur lors du chargement des favoris' });
    }
});

/**
 * GET /api/wishlist/check/:productId — Vérifie si un produit est en favoris
 */
router.get('/check/:productId', authenticateToken, async (req, res) => {
    try {
        const item = await Wishlist.findOne({
            where: { user_id: req.user.id, product_id: req.params.productId }
        });
        res.json({ isInWishlist: !!item });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/wishlist/:productId — Ajouter un produit aux favoris
 */
router.post('/:productId', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.productId);
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

        const [item, created] = await Wishlist.findOrCreate({
            where: { user_id: req.user.id, product_id: req.params.productId }
        });

        res.status(created ? 201 : 200).json({
            message: created ? 'Ajouté aux favoris' : 'Déjà dans les favoris',
            created
        });
    } catch (error) {
        console.error('❌ POST /wishlist:', error.message);
        res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris' });
    }
});

/**
 * DELETE /api/wishlist/:productId — Retirer un produit des favoris
 */
router.delete('/:productId', authenticateToken, async (req, res) => {
    try {
        const deleted = await Wishlist.destroy({
            where: { user_id: req.user.id, product_id: req.params.productId }
        });
        if (!deleted) return res.status(404).json({ error: 'Produit non trouvé dans vos favoris' });
        res.json({ message: 'Retiré des favoris' });
    } catch (error) {
        console.error('❌ DELETE /wishlist:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

export default router;
