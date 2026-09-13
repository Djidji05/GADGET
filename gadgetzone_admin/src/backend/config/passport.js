import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/index.js';

const configurePassport = () => {
    // Serialize user for session (or token payload)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    // GOOGLE STRATEGY
    console.log('🔍 Passport Config Check:');
    console.log('GOOGLE_CLIENT_ID present:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET present:', !!process.env.GOOGLE_CLIENT_SECRET);

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://manage.panyem.com/api/auth/google/callback',
                    passReqToCallback: true
                },
                async (req, accessToken, refreshToken, profile, done) => {
                    try {
                        console.log('Google Profile:', profile);
                        const email = profile.emails[0].value;
                        const googleId = profile.id;
                        const firstName = profile.name?.givenName || '';
                        const lastName = profile.name?.familyName || '';
                        const displayName = `${firstName} ${lastName}`.trim() || profile.displayName || 'Utilisateur';

                        // Check if user exists by googleId
                        let user = await User.findOne({ where: { googleId } });

                        if (user) {
                            // 🔔 Notification in-app pour connexion Google
                            try {
                                const { createNotification } = await import('../utils/notificationHelper.js');
                                await createNotification(
                                    user.id,
                                    'info',
                                    'Connexion Google réussie 🔐',
                                    `Vous vous êtes connecté à votre compte Panyem via Google.`
                                );
                            } catch (nErr) {
                                console.error('❌ [Google Auth] Notification in-app erreur:', nErr.message);
                            }
                            return done(null, user);
                        }

                        // Check if user exists by email
                        user = await User.findOne({ where: { email } });

                        if (user) {
                            // Context: User exists with email but not linked to Google
                            const firstTimeGoogle = !user.googleId;
                            await user.update({ googleId });

                            // 🔔 Notification In-App
                            try {
                                const { createNotification } = await import('../utils/notificationHelper.js');
                                await createNotification(
                                    user.id,
                                    'info',
                                    'Compte Google associé 🔗',
                                    `Votre compte Google (${email}) a été associé avec succès à votre compte Panyem.`
                                );
                            } catch (nErr) {
                                console.error('❌ [Google Auth] Notification in-app erreur:', nErr.message);
                            }

                            if (firstTimeGoogle) {
                                try {
                                    const { sendEmail, emailTemplates } = await import('../services/emailService.js');
                                    if (emailTemplates && emailTemplates.welcomeUser) {
                                        console.log('📧 [Google Auth] Association Google, envoi email de bienvenue à:', email);
                                        const welcome = emailTemplates.welcomeUser(firstName || user.name || 'Client', email);
                                        const result = await sendEmail(email, welcome);
                                        console.log('📧 [Google Auth] Résultat envoi email:', result ? 'SUCCÈS' : 'ÉCHEC');
                                    }
                                } catch (e) {
                                    console.error('❌ [Google Auth] Erreur lors de l\'envoi de l\'email Google:', e.message);
                                }
                            }

                            return done(null, user);
                        }

                        // Create new user (Email jamais enregistré dans la base)
                        user = await User.create({
                            name: displayName,
                            email,
                            role: 'customer',
                            googleId
                        });

                        console.log(`✅ [Google Auth] Nouvel utilisateur créé: ${user.name} (${user.email}, ID: ${user.id})`);

                        // 🔔 1. Notification In-App de bienvenue
                        try {
                            const { createNotification, notifyNewSystemUser } = await import('../utils/notificationHelper.js');
                            await createNotification(
                                user.id,
                                'info',
                                'Bienvenue sur Panyem ! 🎉',
                                `Votre compte Panyem a été créé avec succès via Google. Bienvenue dans notre marché numérique !`
                            );
                            await notifyNewSystemUser(user);
                        } catch (notifErr) {
                            console.error('❌ [Google Auth] Erreur création notification in-app:', notifErr.message);
                        }

                        // 📧 2. Envoi de l'email de bienvenue
                        try {
                            const { sendEmail, emailTemplates } = await import('../services/emailService.js');
                            if (emailTemplates && emailTemplates.welcomeUser) {
                                console.log('📧 [Google Auth] Tentative d\'envoi de l\'email de bienvenue à:', email);
                                const welcome = emailTemplates.welcomeUser(firstName || user.name || 'Client', email);
                                const result = await sendEmail(email, welcome);
                                console.log('📧 [Google Auth] Statut envoi email de bienvenue:', result ? 'SUCCÈS' : 'ÉCHEC/SIMULATION');
                            }
                        } catch (e) {
                            console.error('❌ [Google Auth] Erreur lors de l\'envoi de l\'email de bienvenue:', e.message);
                        }

                        return done(null, user);
                    } catch (err) {
                        console.error('Google Auth Error:', err);
                        return done(err, null);
                    }
                }
            )
        );
    } else {
        console.warn('⚠️ Google Client ID/Secret not found. Google Auth disabled.');
    }

    // FACEBOOK STRATEGY
    if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
        passport.use(
            new FacebookStrategy(
                {
                    clientID: process.env.FACEBOOK_APP_ID,
                    clientSecret: process.env.FACEBOOK_APP_SECRET,
                    callbackURL: '/api/auth/facebook/callback',
                    profileFields: ['id', 'emails', 'name', 'photos'],
                    passReqToCallback: true
                },
                async (req, accessToken, refreshToken, profile, done) => {
                    try {
                        console.log('Facebook Profile:', profile);
                        const email = profile.emails ? profile.emails[0].value : null; // Facebook might not return email
                        const facebookId = profile.id;
                        const firstName = profile.name.givenName;
                        const lastName = profile.name.familyName;

                        // Check by facebookId
                        let user = await User.findOne({ where: { facebookId } });
                        if (user) return done(null, user);

                        // Check by email if exists
                        if (email) {
                            user = await User.findOne({ where: { email } });
                            if (user) {
                                await user.update({ facebookId });
                                return done(null, user);
                            }
                        }

                        // Create user
                        // Note: If no email from FB, we might need a placeholder or handle error. 
                        // For now assuming email exists or generating logic.
                        // If email missing, creating account might fail if email is null in DB (schema says allowNull: false).
                        if (!email) {
                            return done(new Error('Facebook account does not provide email'), null);
                        }

                        user = await User.create({
                            name: `${firstName} ${lastName}`,
                            email,
                            role: 'user',
                            facebookId
                        });

                        return done(null, user);

                    } catch (err) {
                        console.error('Facebook Auth Error:', err);
                        return done(err, null);
                    }
                }
            )
        );
    } else {
        console.warn('⚠️ Facebook App ID/Secret not found. Facebook Auth disabled.');
    }
};

export default configurePassport;
