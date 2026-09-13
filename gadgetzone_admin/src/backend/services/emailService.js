import { Resend } from 'resend';

/**
 * Service d'envoi d'emails professionnels via Resend
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'notifications@panyem.com';

const SITE_URL = process.env.FRONTEND_URL || 'https://panyem.com';

/**
 * Layout HTML Master d'Email professionnel Panyem
 */
const buildMasterEmailLayout = (title, contentHtml) => {
    const currentYear = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    
                    <!-- Header avec Logo & Lien du Site -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 32px 28px 32px; text-align: center;">
                            <a href="${SITE_URL}" target="_blank" style="text-decoration: none; display: inline-block;">
                                <span style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Panyem<span style="color: #3b82f6;">.</span></span>
                            </a>
                            <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">
                                Le Marché Numérique d'Haïti &bull; <a href="${SITE_URL}" target="_blank" style="color: #60a5fa; text-decoration: none; font-weight: 700;">panyem.com</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Corps du Message -->
                    <tr>
                        <td style="padding: 40px 32px; color: #334155; font-size: 15px; line-height: 1.6;">
                            ${contentHtml}
                        </td>
                    </tr>

                    <!-- Footer Officiel avec Lien du Site -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 28px 32px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
                            <p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">Panyem Inc. &bull; Port-au-Prince, Haïti</p>
                            <p style="margin: 0 0 8px 0;">Visitez notre site : <a href="${SITE_URL}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 700;">https://panyem.com</a></p>
                            <p style="margin: 0;">Besoin d'aide ? Notre support est à votre écoute sur <a href="mailto:support@panyem.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">support@panyem.com</a></p>
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
                                &copy; ${currentYear} Panyem. Tous droits réservés.
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Fonction d'envoi d'email flexible et robuste
 */
export const sendEmail = async (to, subject, textContent, htmlContent = null) => {
    let finalSubject = subject;
    let finalText = textContent;
    let finalHtml = htmlContent;

    // Support appel avec objet template : sendEmail(to, templateObj)
    if (typeof subject === 'object' && subject.subject) {
        finalSubject = subject.subject;
        finalText = subject.text;
        finalHtml = subject.html;
    } else if (typeof textContent === 'object' && textContent.text) {
        finalText = textContent.text;
        finalHtml = textContent.html || finalHtml;
    }

    if (!to || !to.includes('@')) {
        console.error('❌ [RESEND] Email destinataire invalide:', to);
        return false;
    }

    // Wrap le HTML dans le layout Master Panyem
    if (finalHtml && !finalHtml.includes('<!DOCTYPE html>')) {
        finalHtml = buildMasterEmailLayout(finalSubject, finalHtml);
    } else if (!finalHtml && finalText) {
        const bodyParagraphs = finalText.split('\n').map(p => `<p style="margin: 0 0 12px 0;">${p}</p>`).join('');
        finalHtml = buildMasterEmailLayout(finalSubject, bodyParagraphs);
    }

    // Mode simulation si pas de clé API valide
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
        console.log(`\n📧 [RESEND SIMULATION] (Clé API non configurée)`);
        console.log(`   Destinataire: ${to}`);
        console.log(`   Sujet: ${finalSubject}`);
        console.log(`   Contenu textuel: ${finalText?.substring(0, 100)}...`);
        return true;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `Panyem <${FROM_EMAIL}>`,
            to: [to],
            subject: finalSubject,
            text: finalText || '',
            html: finalHtml,
        });

        if (error) {
            console.error('❌ [RESEND] Erreur lors de l\'envoi:', error);
            return false;
        }

        console.log(`✅ [RESEND] Email envoyé avec succès à ${to} (ID: ${data?.id})`);
        return true;
    } catch (err) {
        console.error('❌ [RESEND] Exception envoi d\'email:', err.message);
        return false;
    }
};

/**
 * Modèles d'emails professionnels Panyem
 */
export const emailTemplates = {
    // 1. Bienvenue (Inscription Client)
    welcome: (name) => ({
        subject: `Bienvenue sur Panyem, ${name} ! 🎉`,
        text: `Bonjour ${name},\n\nMerci d'avoir rejoint Panyem ! Votre compte est prêt.\n\nExplorez nos produits dès maintenant sur https://panyem.com`,
        html: `
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; padding: 12px 20px; background-color: #eff6ff; border-radius: 9999px; color: #2563eb; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                    🎉 Compte créé avec succès
                </div>
            </div>
            <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Bienvenue chez Panyem, ${name} !</h1>
            <p>Nous sommes ravis de vous compter parmi les membres de la plateforme e-commerce référence en Haïti.</p>
            <p>Vous pouvez dès maintenant parcourir des milliers de produits certifiés, passer vos commandes en toute sécurité et bénéficier de la livraison rapide.</p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="https://panyem.com" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 10px; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">Découvrir le catalogue</a>
            </div>
            <p style="font-size: 13px; color: #64748b;">Si vous avez la moindre question, notre équipe d'assistance est toujours disponible pour vous répondre.</p>
        `
    }),

    // 2. Code de sécurité 2FA
    twoFactor: (code) => ({
        subject: `${code} est votre code de sécurité Panyem 🔒`,
        text: `Bonjour,\n\nVotre code de vérification Panyem est : ${code}\n\nCe code expirera dans 10 minutes.`,
        html: `
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Code de Vérification</h2>
            <p style="text-align: center;">Voici votre code d'accès temporaire pour vous connecter à votre compte Panyem :</p>
            <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; font-size: 36px; font-weight: 900; letter-spacing: 6px; color: #2563eb; border-radius: 12px; margin: 24px 0;">
                ${code}
            </div>
            <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 16px;">Ce code expire dans <strong>10 minutes</strong>. Ne le partagez avec personne.</p>
        `
    }),

    // 3. Confirmation de commande (Client)
    orderConfirmed: (orderNumber, total, itemsCount = 1) => ({
        subject: `Confirmation de votre commande #${orderNumber} ✅`,
        text: `Merci pour votre commande #${orderNumber} sur Panyem ! Montant total : ${total} HTG.`,
        html: `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 8px 16px; background-color: #dcfce7; color: #15803d; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
                    ✓ Commande Confirmée
                </div>
            </div>
            <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">Merci pour votre confiance !</h2>
            <p style="text-align: center; color: #475569;">Votre commande <strong>#${orderNumber}</strong> a été enregistrée avec succès et est en cours de préparation.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
                    <span style="color: #64748b; font-size: 14px;">Numéro de commande</span>
                    <strong style="color: #0f172a; font-size: 14px;">#${orderNumber}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
                    <span style="color: #64748b; font-size: 14px;">Nombre d'articles</span>
                    <strong style="color: #0f172a; font-size: 14px;">${itemsCount}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 16px;">
                    <span style="font-weight: 700; color: #0f172a;">Total payé</span>
                    <strong style="color: #2563eb; font-size: 18px;">${total} HTG</strong>
                </div>
            </div>

            <div style="text-align: center; margin-top: 28px;">
                <a href="https://panyem.com/orders" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px;">Suivre ma commande</a>
            </div>
        `
    }),

    // 4. Mise à jour du statut de commande (Expédié / Livré / Annulé)
    orderStatusUpdate: (orderNumber, statusLabel, trackingNumber = null) => ({
        subject: `Mise à jour de votre commande #${orderNumber} : ${statusLabel} 📦`,
        text: `Votre commande #${orderNumber} est désormais : ${statusLabel}.`,
        html: `
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Mise à jour de votre colis 📦</h2>
            <p>Le statut de votre commande <strong>#${orderNumber}</strong> a changé :</p>
            
            <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <span style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700;">Nouveau statut</span>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">${statusLabel}</div>
                ${trackingNumber ? `<div style="font-size: 13px; color: #475569; margin-top: 8px;">Code de suivi : <strong>${trackingNumber}</strong></div>` : ''}
            </div>

            <p style="font-size: 14px; color: #64748b;">Consultez les détails complets de votre livraison directement depuis votre espace client.</p>
            <div style="margin-top: 24px;">
                <a href="https://panyem.com/orders" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px;">Voir l'état de la commande</a>
            </div>
        `
    }),

    // 5. Réinitialisation de mot de passe
    passwordReset: (resetLink, name = 'Client') => ({
        subject: `Réinitialisation de votre mot de passe Panyem 🔑`,
        text: `Bonjour ${name},\n\nPour réinitialiser votre mot de passe, visitez : ${resetLink}\n\nCe lien expirera dans 30 minutes.`,
        html: `
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Demande de réinitialisation</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Vous avez demandé la réinitialisation du mot de passe de votre compte Panyem. Cliquez sur le bouton ci-dessous pour choisir votre nouveau mot de passe :</p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 8px;">Réinitialiser mon mot de passe</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
        `
    }),

    // 6. Alerte Nouvelle Vente (Vendeur)
    vendorNewOrder: (vendorName, orderNumber, amount) => ({
        subject: `🎉 Nouvelle vente effectuée ! Commande #${orderNumber}`,
        text: `Félicitations ${vendorName} ! Une nouvelle vente de ${amount} HTG a été enregistrée (Commande #${orderNumber}).`,
        html: `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 8px 16px; background-color: #fef3c7; color: #b45309; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
                    💰 Nouvelle Vente Vendeur
                </div>
            </div>
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">Félicitations ${vendorName} !</h2>
            <p style="text-align: center;">Vous avez reçu une nouvelle commande <strong>#${orderNumber}</strong> pour un montant de <strong>${amount} HTG</strong>.</p>
            <div style="text-align: center; margin: 28px 0;">
                <a href="https://panyem.com/seller/orders" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 8px;">Préparer la commande</a>
            </div>
        `
    }),

    // 7. Confirmation de virement (Payout Vendeur)
    vendorPayoutApproved: (vendorName, amount, paymentMethod = 'MonCash') => ({
        subject: `Virement effectué : ${amount} HTG vers votre compte ${paymentMethod} 💳`,
        text: `Bonjour ${vendorName}, votre virement de ${amount} HTG a été validé et envoyé via ${paymentMethod}.`,
        html: `
            <h2 style="color: #10b981; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Virement d'argent validé ! 💵</h2>
            <p>Bonjour <strong>${vendorName}</strong>,</p>
            <p>Votre demande de retrait de vos gains a été approuvée et traitée avec succès.</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <div style="font-size: 13px; color: #64748b;">Montant transféré</div>
                <div style="font-size: 24px; font-weight: 900; color: #10b981; margin-top: 4px;">${amount} HTG</div>
                <div style="font-size: 13px; color: #64748b; margin-top: 8px;">Moyen de paiement : <strong>${paymentMethod}</strong></div>
            </div>
        `
    })
};
