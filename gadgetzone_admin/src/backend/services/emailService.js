import { Resend } from 'resend';

/**
 * Service pour l'envoi d'emails via Resend
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export const sendEmail = async (to, subject, textContent, htmlContent = null) => {
    // Si pas de clé API valide, mode simulation
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
        console.log(`\n📧 [RESEND SIMULATION] (Missing API Key)`);
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Content: ${textContent.substring(0, 100)}...`);
        return true;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `HTFasil <${FROM_EMAIL}>`,
            to: [to],
            subject: subject,
            text: textContent,
            html: htmlContent || `<div style="font-family: sans-serif; white-space: pre-wrap; color: #1a1a1a;">${textContent}</div>`,
        });

        if (error) {
            console.error('❌ [RESEND] Error sending email:', error);
            return false;
        }

        console.log(`✅ [RESEND] Email sent successfully to ${to}. ID: ${data?.id}`);
        return true;
    } catch (err) {
        console.error('❌ [RESEND] Exception while sending email:', err.message);
        return false;
    }
};

/**
 * Templates de base pour la plateforme
 */
export const emailTemplates = {
    welcome: (name) => ({
        subject: `Bienvenue sur HTFasil, ${name} !`,
        text: `Bonjour ${name},\n\nMerci d'avoir créé votre compte sur HTFasil ! Nous sommes ravis de vous compter parmi nous.\n\nBon shopping !`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a;">
                <h1 style="color: #3b82f6;">Bienvenue chez HTFasil !</h1>
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Merci d'avoir créé votre compte. Nous sommes ravis de vous accompagner dans vos achats.</p>
                <a href="https://htfasil.com" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px;">Commencer mon shopping</a>
                <p style="margin-top: 30px; font-size: 0.8em; color: #666;">L'équipe HTFasil</p>
            </div>
        `
    }),
    twoFactor: (code) => ({
        subject: `${code} est votre code de sécurité HTFasil`,
        text: `Bonjour,\n\nVotre code de vérification est : ${code}\n\nCe code expirera dans 10 minutes.`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 400px;">
                <h2 style="color: #1a1a1a;">Code de vérification</h2>
                <p>Voici votre code de sécurité pour vous connecter :</p>
                <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb; border-radius: 8px;">
                    ${code}
                </div>
                <p style="font-size: 13px; color: #666; margin-top: 20px;">Ce code expirera dans 10 minutes.</p>
            </div>
        `
    }),
    orderConfirmed: (orderNumber, total) => ({
        subject: `Confirmation de votre commande #${orderNumber}`,
        text: `Merci pour votre commande #${orderNumber} ! Montant total : ${total} HTG.`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #10b981;">Commande confirmée ! ✅</h2>
                <p>Merci pour votre confiance. Votre commande <strong>#${orderNumber}</strong> est en cours de préparation.</p>
                <p><strong>Total :</strong> ${total} HTG</p>
                <p>Nous vous préviendrons dès que votre colis sera expédié.</p>
            </div>
        `
    })
};
