import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { LoyaltyAccount, LoyaltyTransaction, Achievement, UserAchievement, User } from '../models/index.js';
import loyaltyService from '../services/loyaltyService.js';

const router = express.Router();

// Points par HTG dépensé
const POINTS_PER_HTG = 1;
// HTG de réduction par tranche de points
const HTG_PER_100_POINTS = 5;

/**
 * GET /api/loyalty/me — Solde et historique de l'utilisateur
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        let account = await LoyaltyAccount.findOne({ where: { user_id: req.user.id } });
        if (!account) {
            // Créer le compte à la première consultation
            account = await LoyaltyAccount.create({ user_id: req.user.id, tier: 'bronze' });
        }

        const transactions = await LoyaltyTransaction.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']],
            limit: 50
        });

        // Calcul du niveau (Bronze/Silver/Gold/Diamond)
        const lifetime = account.lifetime_points;
        const level = lifetime >= 15000 ? 'Diamond' : lifetime >= 5000 ? 'Gold' : lifetime >= 1000 ? 'Silver' : 'Bronze';
        const nextLevel = level === 'Bronze' ? { name: 'Silver', threshold: 1000 }
                        : level === 'Silver' ? { name: 'Gold', threshold: 5000 }
                        : level === 'Gold' ? { name: 'Diamond', threshold: 15000 }
                        : null;

        res.json({
            account: {
                points_balance: account.points_balance,
                lifetime_points: account.lifetime_points,
                level,
                next_level: nextLevel,
                redeem_value: Math.floor(account.points_balance / 100) * HTG_PER_100_POINTS
            },
            transactions
        });
    } catch (error) {
        console.error('❌ GET /loyalty/me:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/loyalty/redeem/calculate — Vérifier combien de points l'utilisateur peut utiliser
 */
router.post('/redeem/calculate', authenticateToken, async (req, res) => {
    try {
        const { order_total } = req.body;
        const account = await LoyaltyAccount.findOne({ where: { user_id: req.user.id } });
        if (!account) return res.json({ discount: 0, points_to_use: 0 });

        // Max: 50% de la commande, par tranches de 100 points = 5 HTG
        const maxDiscount = Math.floor(order_total * 0.5);
        const availableDiscount = Math.floor(account.points_balance / 100) * HTG_PER_100_POINTS;
        const discount = Math.min(maxDiscount, availableDiscount);
        const points_to_use = (discount / HTG_PER_100_POINTS) * 100;

        res.json({ discount, points_to_use, points_balance: account.points_balance });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/loyalty/achievements — Liste des achievements et état de déverrouillage
 */
router.get('/achievements', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // S'assurer que les achievements par défaut sont créés en base
        await loyaltyService.seedAchievements();

        const achievements = await Achievement.findAll();
        const unlocked = await UserAchievement.findAll({
            where: { user_id: userId }
        });
        
        const unlockedIds = new Set(unlocked.map(ua => ua.achievement_id));

        const formatted = achievements.map(ach => ({
            id: ach.id,
            code: ach.code,
            name: ach.name,
            description: ach.description,
            icon: ach.icon,
            points_reward: ach.points_reward,
            tier_required: ach.tier_required,
            unlocked: unlockedIds.has(ach.id)
        }));

        res.json(formatted);
    } catch (error) {
        console.error('❌ GET /loyalty/achievements:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/loyalty/leaderboard — Top 10 des utilisateurs fidélité
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const topAccounts = await LoyaltyAccount.findAll({
            limit: 10,
            order: [['lifetime_points', 'DESC']],
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }]
        });

        const formatted = topAccounts.map((acc, index) => {
            const userName = acc.user?.name || 'Client';
            // Masquer l'email pour des raisons de confidentialité
            const emailParts = (acc.user?.email || '').split('@');
            const maskedEmail = emailParts.length === 2 
                ? `${emailParts[0].substring(0, 3)}***@${emailParts[1]}` 
                : '***';

            return {
                rank: index + 1,
                name: userName,
                email: maskedEmail,
                lifetime_points: acc.lifetime_points,
                tier: acc.tier || loyaltyService.calculateTier(acc.lifetime_points)
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error('❌ GET /loyalty/leaderboard:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
