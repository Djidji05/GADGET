import cron from 'node-cron';
import OrderTimeoutService from '../services/OrderTimeoutService.js';

/**
 * Configure et démarre les tâches CRON pour les délais de paiement.
 */
export function startPaymentTimeoutCron() {
    // Exécuter toutes les heures à la minute 0 (0 * * * *)
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('🕒 [CRON] Exécution de la vérification des paiements partiels expirés...');
            const result = await OrderTimeoutService.checkExpiredPartialPayments();
            console.log(`✅ [CRON] Vérification terminée. Scannées: ${result.scanned}, Expirées/Annulées: ${result.expired}`);
        } catch (error) {
            console.error('❌ [CRON] Erreur lors de la vérification des paiements partiels:', error);
        }
    });

    console.log('✅ Tâche CRON de vérification des paiements démarrée (toutes les heures).');
}
