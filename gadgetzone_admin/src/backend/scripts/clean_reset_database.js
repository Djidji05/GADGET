import bcrypt from 'bcrypt';
import sequelize, { initDatabase } from '../config/database.js';
import { User, Setting } from '../models/index.js';

/**
 * Script de nettoyage complet et réinitialisation de la base de données.
 * Vide toutes les tables (DROP & RE-CREATE) et recrée uniquement le compte Administrateur initial.
 */
const cleanResetDatabase = async () => {
  try {
    console.log('🧹 Démarrage du nettoyage complet de la base de données...');

    // 1. Initialiser la connexion
    const dbConnected = await initDatabase();
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // 2. Synchronisation forcée : supprime toutes les tables et les réenvisage vierges
    console.log('⚠️ Suppression et récréation de toutes les tables (force: true)...');
    await sequelize.sync({ force: true });
    console.log('✅ Base de données entièrement réinitialisée à zéro (0 enregistrement)');

    // 3. Création du compte Administrateur par défaut
    console.log('👤 Création du compte Administrateur principal...');
    const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@panyem.com';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error('Veuillez définir la variable d\'environnement ADMIN_INITIAL_PASSWORD avant d\'exécuter ce script.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Panyem',
      name: 'Admin Panyem',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      is_active: true
    });

    console.log(`✅ Compte Administrateur créé avec succès !`);
    console.log(`   - Email : ${adminEmail}`);
    console.log(`   - Rôle : ${adminUser.role}`);

    // 4. Initialisation des paramètres généraux du site
    if (Setting) {
      try {
        await Setting.bulkCreate([
          { key: 'site_name', value: 'Panyem' },
          { key: 'site_logo', value: '/images/logo.webp' },
          { key: 'maintenance_mode', value: 'false' },
          { key: 'usd_exchange_rate', value: '135.00' }
        ], { ignoreDuplicates: true });
        console.log('⚙️ Paramètres généraux initiaux configurés (Panyem).');
      } catch (err) {
        console.log('ℹ️ Remarque : Les paramètres généraux seront créés au premier démarrage.');
      }
    }

    console.log('\n🎉 NETTOYAGE TERMINÉ AVEC SUCCÈS ! La base de données est maintenant vierge.');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données :', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

cleanResetDatabase();
