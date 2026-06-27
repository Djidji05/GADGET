import express from 'express';
import reviewController from '../controllers/ReviewController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Review, ReviewVote, Order, OrderItem, sequelize } from '../models/index.js';

const router = express.Router();

/**
 * GET /api/reviews/product/:productId
 */
router.get('/product/:productId', reviewController.getByProduct);

/**
 * POST /api/reviews
 * Auto-vérifie si l'utilisateur a acheté le produit (commande delivered)
 */
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.user?.id;
        const { productId } = req.body;

        // Vérifier si l'utilisateur a une commande livrée contenant ce produit
        if (productId) {
            const verifiedOrder = await Order.findOne({
                where: { user_id: userId, status: 'delivered' },
                include: [{
                    model: OrderItem,
                    as: 'items',
                    where: { product_id: productId },
                    required: true
                }]
            });

            if (verifiedOrder) {
                req.body.is_verified_purchase = true;
            }
        }

        // Passer au controller existant
        next();
    } catch (error) {
        console.error('Review verification error:', error.message);
        next(); // Ne pas bloquer si la vérification échoue
    }
}, reviewController.create);

/**
 * DELETE /api/reviews/:id
 */
router.delete('/:id', authenticateToken, reviewController.delete);

/**
 * POST /api/reviews/:id/vote — Voter "utile" ou "inutile" sur un avis
 */
router.post('/:id/vote', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.id;
        const reviewId = parseInt(req.params.id);
        const { vote } = req.body; // 'helpful' or 'not_helpful'

        if (!['helpful', 'not_helpful'].includes(vote)) {
            return res.status(400).json({ error: 'Vote invalide. Valeurs acceptées: helpful, not_helpful' });
        }

        // Vérifier que l'avis existe
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Avis non trouvé' });
        }

        // Empêcher de voter sur son propre avis
        if (review.user_id === userId) {
            return res.status(400).json({ error: 'Vous ne pouvez pas voter sur votre propre avis' });
        }

        // Transaction pour l'atomicité
        const result = await sequelize.transaction(async (t) => {
            // Chercher un vote existant
            const existingVote = await ReviewVote.findOne({
                where: { user_id: userId, review_id: reviewId },
                transaction: t
            });

            if (existingVote) {
                if (existingVote.vote === vote) {
                    // Annuler le vote (toggle)
                    await existingVote.destroy({ transaction: t });
                    
                    // Décrémenter le compteur
                    if (vote === 'helpful') {
                        await review.decrement('helpful_count', { transaction: t });
                    } else {
                        await review.decrement('not_helpful_count', { transaction: t });
                    }
                    
                    return { action: 'removed', vote: null };
                } else {
                    // Changer le vote
                    const oldVote = existingVote.vote;
                    await existingVote.update({ vote }, { transaction: t });
                    
                    // Ajuster les compteurs
                    if (oldVote === 'helpful') {
                        await review.decrement('helpful_count', { transaction: t });
                        await review.increment('not_helpful_count', { transaction: t });
                    } else {
                        await review.decrement('not_helpful_count', { transaction: t });
                        await review.increment('helpful_count', { transaction: t });
                    }
                    
                    return { action: 'changed', vote };
                }
            } else {
                // Nouveau vote
                await ReviewVote.create({
                    user_id: userId,
                    review_id: reviewId,
                    vote
                }, { transaction: t });

                // Incrémenter le compteur
                if (vote === 'helpful') {
                    await review.increment('helpful_count', { transaction: t });
                } else {
                    await review.increment('not_helpful_count', { transaction: t });
                }

                return { action: 'created', vote };
            }
        });

        // Recharger les compteurs
        await review.reload();

        res.json({
            ...result,
            helpful_count: review.helpful_count,
            not_helpful_count: review.not_helpful_count
        });
    } catch (error) {
        console.error('❌ Vote review error:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/reviews/pending
 */
router.get('/pending', authenticateToken, requireAdmin, reviewController.getPending);

/**
 * PATCH /api/reviews/:id/status
 */
router.patch('/:id/status', authenticateToken, requireAdmin, reviewController.moderate);

export default router;
