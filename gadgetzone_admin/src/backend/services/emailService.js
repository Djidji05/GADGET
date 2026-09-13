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
    }),

    // 8. Alerte Admin : Nouvelle Candidature Vendeur
    adminVendorApplication: (storeName, applicantName, applicantEmail) => ({
        subject: `🚨 Alerte Admin : Nouvelle candidature boutique "${storeName}"`,
        text: `Bonjour Admin,\n\n${applicantName} (${applicantEmail}) vient de soumettre une demande d'ouverture de boutique pour "${storeName}".\n\nConsultez la candidature : https://manage.panyem.com/vendors/applications`,
        html: `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 8px 16px; background-color: #dbeafe; color: #1e40af; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
                    📋 Candidature Vendeur Reçue
                </div>
            </div>
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">Nouvelle Demande de Boutique</h2>
            <p style="text-align: center; color: #475569;">Un vendeur a soumis son dossier pour rejoindre Panyem :</p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                    <span style="color: #64748b;">Nom de la boutique</span>
                    <strong style="color: #0f172a;">${storeName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                    <span style="color: #64748b;">Nom du candidat</span>
                    <strong style="color: #0f172a;">${applicantName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b;">Email</span>
                    <strong style="color: #2563eb;">${applicantEmail}</strong>
                </div>
            </div>

            <div style="text-align: center; margin-top: 28px;">
                <a href="https://manage.panyem.com/vendors/applications" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 10px;">Examiner la candidature</a>
            </div>
        `
    }),

    // 9. Alerte Admin : Nouveau Message / Ticket de Contact
    adminContactTicket: (ticketId, name, email, subject, message) => ({
        subject: `📩 [Ticket #${ticketId}] Nouveau message : ${subject}`,
        text: `Bonjour Admin,\n\nVous avez reçu un nouveau message de ${name} (${email}) - Ticket #${ticketId}.\n\nMessage:\n${message}`,
        html: `
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Nouveau Message Support (Ticket #${ticketId})</h2>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Expéditeur :</strong> ${name} (<a href="mailto:${email}" style="color: #2563eb;">${email}</a>)</p>
                <p style="margin: 0 0 12px 0;"><strong>Sujet :</strong> ${subject}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 12px 0;">
                <div style="font-size: 14px; color: #334155; white-space: pre-wrap;">${message}</div>
            </div>
            <div style="text-align: center; margin-top: 24px;">
                <a href="https://manage.panyem.com/support/tickets" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 8px;">Répondre au ticket</a>
            </div>
        `
    }),

    // 10. Candidature Vendeur Approuvée (Envoyé au Vendeur)
    vendorApplicationApproved: (vendorName, storeName) => ({
        subject: `🎉 Votre candidature boutique "${storeName}" a été approuvée !`,
        text: `Félicitations ${vendorName} !\n\nVotre demande d'ouverture de la boutique "${storeName}" sur Panyem a été approuvée par nos administrateurs.\n\nVous pouvez désormais vous connecter à votre Espace Vendeur et publier vos premiers produits :\n${SITE_URL}/seller`,
        html: `
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; padding: 10px 20px; background-color: #dcfce7; color: #15803d; font-weight: 700; font-size: 13px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
                    ✓ Candidature Approuvée
                </div>
            </div>
            <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Félicitations ${vendorName} !</h1>
            <p>Nous avons le plaisir de vous informer que votre demande d'ouverture de la boutique <strong>"${storeName}"</strong> a été validée par notre équipe d'administration.</p>
            <p>Votre compte vendeur est maintenant actif. Vous pouvez accéder dès aujourd'hui à votre tableau de bord vendeur pour configurer vos options de livraison, ajouter des produits et recevoir des commandes.</p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${SITE_URL}/seller" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 10px; box-shadow: 0 4px 12px rgba(22,163,74,0.25);">Accéder à mon Espace Vendeur</a>
            </div>
            <p style="font-size: 13px; color: #64748b;">Si vous avez besoin d'accompagnement pour démarrer votre activité sur Panyem, n'hésitez pas à contacter notre équipe support sur <a href="mailto:support@panyem.com" style="color: #2563eb;">support@panyem.com</a>.</p>
        `
    }),

    // 11. Candidature Vendeur Rejetée (Envoyé au Vendeur)
    vendorApplicationRejected: (vendorName, storeName, reason = null) => ({
        subject: `Mise à jour concernant votre demande de boutique "${storeName}"`,
        text: `Bonjour ${vendorName},\n\nNous avons examiné votre demande d'ouverture de la boutique "${storeName}". Malheureusement, nous ne pouvons pas l'approuver pour le moment.${reason ? `\n\nRaison: ${reason}` : ''}\n\nVous pouvez contacter le support à support@panyem.com pour toute précision.`,
        html: `
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; padding: 10px 20px; background-color: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 13px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
                    Information Candidature
                </div>
            </div>
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Décision concernant la boutique "${storeName}"</h2>
            <p>Bonjour <strong>${vendorName}</strong>,</p>
            <p>Nous vous remercions pour l'intérêt que vous portez à Panyem. Après examen de votre dossier de candidature pour la boutique <strong>"${storeName}"</strong>, nous ne sommes pas en mesure d'approuver votre demande pour le moment.</p>
            ${reason ? `
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <div style="font-size: 12px; color: #991b1b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Motif de la décision</div>
                <div style="font-size: 14px; color: #7f1d1d; margin-top: 6px; font-weight: 500;">${reason}</div>
            </div>
            ` : ''}
            <p style="font-size: 14px; color: #475569;">Si vous souhaitez obtenir plus d'informations ou soumettre des documents complémentaires, vous pouvez nous écrire sur <a href="mailto:support@panyem.com" style="color: #2563eb;">support@panyem.com</a>.</p>
        `
    }),

    // 12. Suspension / Réactivation de Boutique (Envoyé au Vendeur)
    vendorStatusUpdate: (vendorName, storeName, newStatus, reason = null) => {
        const isSuspended = newStatus === 'SUSPENDED' || newStatus === 'suspended';
        return {
            subject: isSuspended ? `⚠️ Notification importante : Votre boutique "${storeName}" a été suspendue` : `✅ Votre boutique "${storeName}" a été réactivée !`,
            text: isSuspended 
                ? `Bonjour ${vendorName},\n\nVotre boutique "${storeName}" a été suspendue par l'administration.${reason ? ` Raison: ${reason}` : ''}`
                : `Bonjour ${vendorName},\n\nBonne nouvelle ! Votre boutique "${storeName}" a été réactivée par l'administration. Vos produits sont de nouveau visibles sur Panyem.`,
            html: isSuspended ? `
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; padding: 10px 20px; background-color: #fef3c7; color: #b45309; font-weight: 700; font-size: 13px; border-radius: 9999px; text-transform: uppercase;">
                        ⚠️ Suspension de compte
                    </div>
                </div>
                <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Boutique "${storeName}" suspendue</h2>
                <p>Bonjour <strong>${vendorName}</strong>,</p>
                <p>Nous vous informons que les activités de votre boutique <strong>"${storeName}"</strong> ont été temporairement suspendues par l'équipe d'administration.</p>
                ${reason ? `
                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                    <div style="font-size: 12px; color: #b45309; font-weight: 700; text-transform: uppercase;">Raison de la suspension</div>
                    <div style="font-size: 14px; color: #92400e; margin-top: 6px;">${reason}</div>
                </div>
                ` : ''}
                <p style="font-size: 14px; color: #475569;">Veuillez contacter le support à <a href="mailto:support@panyem.com" style="color: #2563eb;">support@panyem.com</a> pour résoudre cette situation.</p>
            ` : `
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; padding: 10px 20px; background-color: #dcfce7; color: #15803d; font-weight: 700; font-size: 13px; border-radius: 9999px; text-transform: uppercase;">
                        ✅ Boutique Réactivée
                    </div>
                </div>
                <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Bonne nouvelle ${vendorName} !</h2>
                <p>Votre boutique <strong>"${storeName}"</strong> a été réactivée. Vos produits sont à nouveau visibles et vous pouvez recevoir des commandes dès maintenant.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${SITE_URL}/seller" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 10px;">Accéder à la boutique</a>
                </div>
            `
        };
    },

    // 13. Rejet de Retrait / Payout (Envoyé au Vendeur)
    vendorPayoutRejected: (vendorName, amount, reason = null) => ({
        subject: `Information concernant votre demande de retrait de ${amount} HTG`,
        text: `Bonjour ${vendorName},\n\nVotre demande de retrait de ${amount} HTG n'a pas pu être traitée.${reason ? ` Raison: ${reason}` : ''}`,
        html: `
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Demande de retrait non validée</h2>
            <p>Bonjour <strong>${vendorName}</strong>,</p>
            <p>Nous vous informons que votre demande de retrait d'un montant de <strong>${amount} HTG</strong> n'a pas été validée.</p>
            ${reason ? `
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <div style="font-size: 12px; color: #991b1b; font-weight: 700; text-transform: uppercase;">Raison du rejet</div>
                <div style="font-size: 14px; color: #7f1d1d; margin-top: 4px;">${reason}</div>
            </div>
            ` : ''}
            <p style="font-size: 13px; color: #64748b;">Le montant est réaffecté à votre solde disponible. Pour toute question, contactez notre équipe sur <a href="mailto:support@panyem.com" style="color: #2563eb;">support@panyem.com</a>.</p>
        `
    }),

    // 14. Message Litige / Réponse Support (Envoyé au Client)
    disputeMessageAlert: (customerName, disputeId, senderName, messageSnippet) => ({
        subject: `Nouveau message sur votre litige #${disputeId} 📩`,
        text: `Bonjour ${customerName},\n\n${senderName} a envoyé une réponse concernant votre litige #${disputeId} :\n\n"${messageSnippet}"\n\nConsultez le litige sur ${SITE_URL}/orders`,
        html: `
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0;">Nouveau message dans le litige #${disputeId}</h2>
            <p>Bonjour <strong>${customerName}</strong>,</p>
            <p>Une nouvelle réponse a été ajoutée au litige <strong>#${disputeId}</strong> par <strong>${senderName}</strong> :</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; margin: 20px 0; font-style: italic; color: #334155;">
                "${messageSnippet}"
            </div>
            <div style="text-align: center; margin-top: 24px;">
                <a href="${SITE_URL}/orders" style="display: inline-block; padding: 12px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 8px;">Voir et répondre sur Panyem</a>
            </div>
        `
    }),

    // 15. Confirmation de Remboursement (Envoyé au Client)
    userRefundCompleted: (customerName, orderId, refundAmount, paymentMethod, reference = null) => ({
        subject: `Confirmation de votre remboursement de ${refundAmount} HTG 💳`,
        text: `Bonjour ${customerName},\n\nVotre remboursement de ${refundAmount} HTG pour la commande #${orderId} a été effectué avec succès via ${paymentMethod}.${reference ? ` Référence: ${reference}` : ''}`,
        html: `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 8px 16px; background-color: #dcfce7; color: #15803d; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase;">
                    ✓ Remboursement Effectué
                </div>
            </div>
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">Remboursement Traité avec Succès</h2>
            <p>Bonjour <strong>${customerName}</strong>,</p>
            <p>Nous vous confirmons que le remboursement lié à la commande <strong>#${orderId}</strong> a été traité.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                    <span style="color: #64748b;">Montant remboursé</span>
                    <strong style="color: #16a34a; font-size: 18px;">${refundAmount} HTG</strong>
                </div>
                <div style="display: flex; justify-content: space-between; ${reference ? 'border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;' : ''}">
                    <span style="color: #64748b;">Moyen de versement</span>
                    <strong style="color: #0f172a;">${paymentMethod}</strong>
                </div>
                ${reference ? `
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b;">Référence de transaction</span>
                    <strong style="color: #2563eb;">${reference}</strong>
                </div>
                ` : ''}
            </div>
            
            <p style="font-size: 13px; color: #64748b;">Le délai d'apparition du crédit dépend de votre établissement financier ou service de paiement.</p>
        `
    }),

    // 16. Email de Bienvenue lors de l'Inscription
    welcomeUser: (userName, email) => ({
        subject: `Bienvenue sur Panyem, ${userName} ! 🚀`,
        text: `Bonjour ${userName},\n\nBienvenue sur Panyem, le marché numérique d'Haïti ! Votre compte (${email}) a été créé avec succès. Visitez https://panyem.com pour découvrir nos produits.`,
        html: `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; padding: 8px 16px; background-color: #dbeafe; color: #1d4ed8; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase;">
                    👋 Bienvenue chez Panyem
                </div>
            </div>
            <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 12px 0; text-align: center;">Ravis de vous compter parmi nous, ${userName} !</h2>
            <p>Bonjour <strong>${userName}</strong>,</p>
            <p>Votre compte client a été créé avec succès sur <strong>Panyem</strong> avec l'adresse email <strong style="color: #2563eb;">${email}</strong>.</p>
            <p>Vous pouvez dès maintenant parcourir les boutiques, commander vos produits préférés et suivre vos livraisons en temps réel.</p>
            
            <div style="text-align: center; margin: 32px 0;">
                <a href="${SITE_URL}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 10px; font-size: 16px;">Découvrir les produits sur Panyem</a>
            </div>
        `
    })
};

