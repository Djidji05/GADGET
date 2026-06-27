import { Order, OrderPayment, OrderItem, Product, Store, User, OrderLog, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import { notifyOrderCancelledRefundPending } from '../utils/notificationHelper.js';

export default class OrderTimeoutService {
    /**
     * Vérifie les commandes partiellement payées qui ont dépassé le délai de 24h.
     * Les annule et passe le statut en `cancelled_refund_pending`.
     */
    static async checkExpiredPartialPayments() {
        try {
            console.log('⏳ [OrderTimeoutService] Checking for expired partially paid orders...');
            
            // 24 heures en arrière
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Trouver les commandes partially_paid dont le dernier update est < 24h ago
            const expiredOrders = await Order.findAll({
                where: {
                    status: 'partially_paid',
                    updated_at: { [Op.lt]: twentyFourHoursAgo }
                },
                include: ['user', 'items']
            });

            if (expiredOrders.length === 0) {
                console.log('✅ [OrderTimeoutService] No expired partial payments found.');
                return { scanned: 0, expired: 0 };
            }

            console.log(`⚠️ [OrderTimeoutService] Found ${expiredOrders.length} expired orders. Processing cancellations...`);

            let cancelledCount = 0;

            for (const order of expiredOrders) {
                await sequelize.transaction(async (t) => {
                    const lockedOrder = await Order.findByPk(order.id, {
                        transaction: t,
                        lock: t.LOCK.UPDATE
                    });

                    if (!lockedOrder || lockedOrder.status !== 'partially_paid') return;

                    // 1. Changer le statut
                    lockedOrder.status = 'cancelled_refund_pending';
                    await lockedOrder.save({ transaction: t });

                    // 2. Log l'action
                    await OrderLog.create({
                        order_id: lockedOrder.id,
                        action: 'cancelled_due_to_timeout',
                        old_status: 'partially_paid',
                        new_status: 'cancelled_refund_pending',
                        details: `Le délai de 24h a expiré pour régler le solde restant. Montant à rembourser: ${lockedOrder.total_paid} HTG.`
                    }, { transaction: t });

                    // 3. Notifier
                    await notifyOrderCancelledRefundPending(order, lockedOrder.total_paid);
                    
                    cancelledCount++;
                    console.log(`❌ [OrderTimeoutService] Order #${lockedOrder.id} cancelled (refund pending).`);
                });
            }

            return { scanned: expiredOrders.length, expired: cancelledCount };
        } catch (error) {
            console.error('❌ [OrderTimeoutService] Error checking expired payments:', error);
            throw error;
        }
    }
}
