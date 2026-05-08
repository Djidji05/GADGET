import nodemailer from 'nodemailer';
import db from '../models/index.js';

/**
 * Utilitaires pour envoyer des emails (Panier Abandonné, Notifications)
 */
export const sendEmail = async ({ to, subject, html }) => {
    try {
        // Fetch SMTP config from Settings Table
        const settings = await db.Setting.findAll({ where: { category: 'email' } });
        const config = {};
        settings.forEach(s => { config[s.key] = s.value; });

        if (!config.smtp_host || !config.smtp_user) {
            console.warn('⚠️ [Mailer] SMTP non configuré dans les paramètres admin. Email ignoré.');
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: config.smtp_host,
            port: parseInt(config.smtp_port || '587'),
            secure: config.smtp_secure === 'true',
            auth: {
                user: config.smtp_user,
                pass: config.smtp_password
            }
        });

        const mailOptions = {
            from: `"${config.from_name || 'HTFasil'}" <${config.from_email || 'noreply@htfasil.com'}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 [Mailer] Email envoyé à ${to} - ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ [Mailer] Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};
