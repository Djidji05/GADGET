import cron from 'node-cron';
import { Op } from 'sequelize';
import { Order, OrderLog, Notification, Setting } from '../models/index.js';

const startMonCashExpirationCron = () => {
    // S'exécute toutes les heures
    cron.schedule('0 * * * *', async () => {
        console.log('🔄 [CRON] Vérification des paiements partiels MonCash expirés...');

        try {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            const expiredOrders = await Order.findAll({
                where: {
                    status: 'partially_paid',
                    created_at: { [Op.lt]: twentyFourHoursAgo }
                },
                include: ['user']
            });

            if (!expiredOrders || expiredOrders.length === 0) {
                console.log('✅ [CRON] Aucune commande partielle expirée trouvée.');
                return;
            }

            console.log(`⏳ [CRON] ${expiredOrders.length} commande(s) expirée(s) détectée(s). Annulation en cours...`);

            for (const order of expiredOrders) {
                const totalPaid = Number(order.total_paid || 0);

                // 1. Mettre à jour le statut
                order.status = 'cancelled_refund_pending';
                await order.save();

                // 2. Log de l'action
                await OrderLog.create({
                    order_id: order.id,
                    action: 'payment_expired',
                    details: `Délai de paiement (24h) dépassé. Statut passé à cancelled_refund_pending. Montant à rembourser: ${totalPaid} HTG.`
                });

                // 3. Notification au client
                if (order.user_id) {
                    await Notification.create({
                        user_id: order.user_id,
                        title: 'Commande annulée (Délai expiré)',
                        message: `Le délai de 24h pour payer la commande #${order.id} est dépassé. Elle a été annulée et un remboursement de ${totalPaid} HTG est en cours.`,
                        type: 'order_status',
                        link: `/orders/${order.id}`
                    });
                }

                // 4. Notification Vendeur (si applicable)
                if (order.store_id) {
                    const { Store } = await import('../models/index.js');
                    const store = await Store.findByPk(order.store_id);
                    if (store && store.userId) {
                        await Notification.create({
                            user_id: store.userId,
                            title: 'Paiement expiré',
                            message: `La commande #${order.id} n'a pas été payée en totalité dans les 24h. Elle a été annulée.`,
                            type: 'order_status',
                            link: `/seller/orders/${order.id}`
                        });
                    }
                }
            }

            console.log('✅ [CRON] Cycle d\'expiration MonCash terminé avec succès.');

        } catch (error) {
            console.error('❌ [CRON] Erreur dans le script d\'expiration MonCash:', error);
        }
    });

    console.log('🕒 [Node-Cron] Tâche "Expiration MonCash" planifiée (scan 1x/heure).');
};

export default startMonCashExpirationCron;
