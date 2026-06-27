import express from 'express';
import { Boost, Product, sequelize } from '../models/index.js';

const router = express.Router();

/**
 * POST /api/boosts/:id/impression
 * Enregistrer une impression (affichage) sur un produit sponsorisé
 */
router.post('/:id/impression', async (req, res) => {
    try {
        const { id } = req.params;
        
        await sequelize.transaction(async (t) => {
            const boost = await Boost.findByPk(id, {
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!boost || boost.status !== 'active') return;

            // Incrémenter les impressions
            boost.impressions += 1;

            if (boost.cost_model === 'cpm') {
                const cost = Number(boost.cost_per_thousand_impressions || 20.00) / 1000;
                boost.spent = Number(boost.spent) + cost;
            }

            // Vérifier si le budget est épuisé ou si la date de fin est dépassée
            const now = new Date();
            const isExpired = boost.endsAt && now > new Date(boost.endsAt);
            const isBudgetExhausted = boost.budget && Number(boost.spent) >= Number(boost.budget);

            if (isBudgetExhausted || isExpired) {
                boost.status = 'expired';
                
                // Désactiver le sponsoring du produit
                await Product.update(
                    { is_sponsored: false },
                    { where: { id: boost.productId }, transaction: t }
                );
            }

            await boost.save({ transaction: t });
        });

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Boost impression error:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/boosts/:id/click
 * Enregistrer un clic sur un produit sponsorisé
 */
router.post('/:id/click', async (req, res) => {
    try {
        const { id } = req.params;

        await sequelize.transaction(async (t) => {
            const boost = await Boost.findByPk(id, {
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!boost || boost.status !== 'active') return;

            // Incrémenter les clics
            boost.clicks += 1;

            if (boost.cost_model === 'cpc') {
                const cost = Number(boost.cost_per_click || 5.00);
                boost.spent = Number(boost.spent) + cost;
            }

            // Vérifier si le budget est épuisé ou si la date de fin est dépassée
            const now = new Date();
            const isExpired = boost.endsAt && now > new Date(boost.endsAt);
            const isBudgetExhausted = boost.budget && Number(boost.spent) >= Number(boost.budget);

            if (isBudgetExhausted || isExpired) {
                boost.status = 'expired';

                // Désactiver le sponsoring du produit
                await Product.update(
                    { is_sponsored: false },
                    { where: { id: boost.productId }, transaction: t }
                );
            }

            await boost.save({ transaction: t });
        });

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Boost click error:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
