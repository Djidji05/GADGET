import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { sendEmail } from '../utils/mailer.js';

/**
 * Tâche automatisée de relance de panier abandonné
 */
const startAbandonedCartCron = () => {
    // S'exécute chaque heure ('0 * * * *')
    cron.schedule('0 * * * *', async () => {
        console.log('🔄 [CRON] Vérification des paniers abandonnés en cours...');
        
        try {
            // Calculer l'heure qu'il était il y a 4 heures
            const fourHoursAgo = new Date();
            fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

            // Rechercher les paniers 'active' qui n'ont pas été modifiés depuis plus de 4 heures
            // et à qui on n'a pas encore envoyé d'email
            const abandonedCarts = await db.Cart.findAll({
                where: {
                    status: 'active',
                    updatedAt: {
                        [Op.lt]: fourHoursAgo // Moins que (avant) il y a 4h
                    },
                    recovery_email_sent: false
                },
                include: [
                    { 
                        model: db.User, 
                        as: 'customer', 
                        attributes: ['id', 'firstname', 'email'] 
                    },
                    {
                        model: db.CartItem,
                        as: 'items',
                        include: [{ model: db.Product, as: 'product', attributes: ['name', 'price', 'mainImage'] }]
                    }
                ]
            });

            if (abandonedCarts.length === 0) {
                console.log('✅ [CRON] Aucun panier abandonné récent trouvé.');
                return;
            }

            console.log(`🛒 [CRON] ${abandonedCarts.length} panier(s) abandonné(s) détecté(s). Envoi des emails...`);

            for (const cart of abandonedCarts) {
                const user = cart.customer;
                if (!user || (!user.email)) continue;

                // Construction de l'objet Email
                let itemsHtml = '<ul style="list-style-type: none; padding: 0;">';
                for (const item of cart.items) {
                    itemsHtml += `
                        <li style="margin-bottom: 10px; display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <img src="${item.product.mainImage}" alt="produit" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;" />
                            <div>
                                <strong>${item.product.name}</strong><br/>
                                <span style="color: #666;">Quantité : ${item.quantity}</span>
                            </div>
                        </li>
                    `;
                }
                itemsHtml += '</ul>';

                const subject = `Vous avez oublié quelque chose sur HTFasil, ${user.firstname} ? 😱`;
                const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2563eb;">Oups... Un oubli !</h2>
                        <p>Bonjour ${user.firstname},</p>
                        <p>Nous avons remarqué que vous avez laissé des articles formidables dans votre panier. Ils sont toujours là, bien au chaud ! 🔥</p>
                        ${itemsHtml}
                        <p style="margin-top: 20px;">Pour vous remercier de votre intérêt, voici un code promo exclusif de <strong>5% de réduction</strong> valable 48 heures :</p>
                        <div style="background-color: #fef08a; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <h3 style="margin: 0; color: #854d0e;">RETOUR5</h3>
                        </div>
                        <a href="https://htfasil.com/cart" style="display: block; width: 100%; text-align: center; background-color: #2563eb; color: white; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            Finaliser ma commande 🚀
                        </a>
                        <p style="font-size: 11px; color: #888; margin-top: 30px;">Si vous avez besoin d'aide avec votre commande, n'hésitez pas à nous contacter.</p>
                    </div>
                `;

                // Tenter d'envoyer l'email
                const sent = await sendEmail({ to: user.email, subject, html });

                // Marquer le panier comme "relancé" pour ne pas spammer
                if (sent) {
                    await cart.update({ 
                        status: 'abandoned',
                        recovery_email_sent: true 
                    });
                }
            }

            console.log('✅ [CRON] Cycle de relance terminé avec succès.');

        } catch (error) {
            console.error('❌ [CRON] Erreur dans le script des paniers abandonnés:', error);
        }
    });

    console.log('🕒 [Node-Cron] Tâche "Relance Panier Abandonné" planifiée (scan 1x/heure).');
};

export default startAbandonedCartCron;
