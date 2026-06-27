import { LoyaltyAccount, LoyaltyTransaction, Achievement, UserAchievement, User, sequelize } from '../models/index.js';
import { sendToUser } from '../utils/sseManager.js';
import webPushService from './webPushService.js';

export const loyaltyService = {
    /**
     * Calcule le tier à partir des points lifetime
     */
    calculateTier: (lifetimePoints) => {
        if (lifetimePoints >= 15000) return 'diamond';
        if (lifetimePoints >= 5000) return 'gold';
        if (lifetimePoints >= 1000) return 'silver';
        return 'bronze';
    },

    /**
     * Met à jour le tier d'un compte fidélité et attribue les bénéfices
     */
    updateAccountTier: async (account, transaction = null) => {
        const newTier = loyaltyService.calculateTier(account.lifetime_points);
        if (account.tier !== newTier) {
            account.tier = newTier;
            // Définir une date d'expiration de 12 mois si besoin
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + 12);
            account.tier_expires_at = expiry;
            await account.save({ transaction });
            
            // Notifier l'utilisateur du changement de niveau
            sendToUser(account.user_id, 'tier_upgrade', { tier: newTier });
            webPushService.sendToUser(
                account.user_id,
                '🌟 Promotion de niveau fidélité !',
                `Félicitations ! Vous êtes passé au niveau ${newTier.toUpperCase()}.`,
                { url: '/account/loyalty', type: 'loyalty_upgrade' }
            ).catch(() => {});
        }
    },

    /**
     * Ajoute des points fidélité à un utilisateur
     */
    addPoints: async (userId, points, description, transaction = null) => {
        if (points <= 0) return null;

        const execute = async (t) => {
            let account = await LoyaltyAccount.findOne({
                where: { user_id: userId },
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!account) {
                account = await LoyaltyAccount.create({ user_id: userId, tier: 'bronze' }, { transaction: t });
            }

            account.points_balance = Number(account.points_balance) + points;
            account.lifetime_points = Number(account.lifetime_points) + points;
            await account.save({ transaction: t });

            // Enregistrer la transaction
            const tx = await LoyaltyTransaction.create({
                user_id: userId,
                loyalty_account_id: account.id,
                type: 'earn',
                points,
                description
            }, { transaction: t });

            // Mettre à jour le niveau
            await loyaltyService.updateAccountTier(account, t);

            // Notifier l'utilisateur
            sendToUser(userId, 'points_earned', { points, balance: account.points_balance });

            return { account, transaction: tx };
        };

        if (transaction) {
            return await execute(transaction);
        } else {
            return await sequelize.transaction(execute);
        }
    },

    /**
     * Débloque un achievement pour un utilisateur
     */
    unlockAchievement: async (userId, achievementCode) => {
        try {
            const achievement = await Achievement.findOne({ where: { code: achievementCode } });
            if (!achievement) return false;

            // Vérifier s'il est déjà débloqué
            const existing = await UserAchievement.findOne({
                where: { user_id: userId, achievement_id: achievement.id }
            });
            if (existing) return false;

            // Débloquer dans une transaction
            await sequelize.transaction(async (t) => {
                await UserAchievement.create({
                    user_id: userId,
                    achievement_id: achievement.id
                }, { transaction: t });

                // Attribuer la récompense en points
                if (achievement.points_reward > 0) {
                    await loyaltyService.addPoints(
                        userId, 
                        achievement.points_reward, 
                        `Badge débloqué : ${achievement.name}`, 
                        t
                    );
                }
            });

            // Notifier en direct
            sendToUser(userId, 'achievement_unlocked', {
                code: achievement.code,
                name: achievement.name,
                points: achievement.points_reward
            });

            webPushService.sendToUser(
                userId,
                `🏆 Nouveau Badge Débloqué : ${achievement.name} !`,
                `Vous avez gagné le badge "${achievement.name}" et +${achievement.points_reward} points.`,
                { url: '/account/loyalty', type: 'achievement' }
            ).catch(() => {});

            return true;
        } catch (error) {
            console.error(`❌ Unlock achievement ${achievementCode} error:`, error.message);
            return false;
        }
    },

    /**
     * Initialise les achievements de base en base de données
     */
    seedAchievements: async () => {
        const defaults = [
            { code: 'first_purchase', name: 'Premier Pas', description: 'Effectuer votre premier achat sur la plateforme.', points_reward: 200, icon: 'shopping-bag' },
            { code: 'reviewer', name: 'Critique Débutant', description: 'Publier votre premier avis sur un produit.', points_reward: 100, icon: 'comment-dots' },
            { code: 'influencer', name: 'Influenceur Local', description: 'Avoir publié 10 avis vérifiés sur des produits.', points_reward: 500, icon: 'star' },
            { code: 'big_spender', name: 'Acheteur VIP', description: 'Total d\'achats supérieur à 10 000 HTG.', points_reward: 1000, icon: 'crown' },
            { code: 'referral', name: 'Parrain de Choc', description: 'Inviter un ami qui effectue son premier achat.', points_reward: 300, icon: 'users' }
        ];

        for (const item of defaults) {
            await Achievement.findOrCreate({
                where: { code: item.code },
                defaults: item
            });
        }
    }
};
export default loyaltyService;
