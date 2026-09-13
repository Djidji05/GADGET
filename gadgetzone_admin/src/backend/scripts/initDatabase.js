import bcrypt from 'bcrypt';
import sequelize, { initDatabase, syncDatabase } from '../config/database.js';
import { Category, Product, User } from '../models/index.js';

/**
 * Script d'initialisation de la base de données
 */
const initializeDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Initialiser la connexion
    const dbConnected = await initDatabase();
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // Synchroniser les modèles
    const syncResult = await syncDatabase({ force: false, alter: true });
    if (!syncResult) {
      console.error('❌ Impossible de synchroniser la base de données');
      process.exit(1);
    }

    console.log('✅ Base de données synchronisée');

    console.log('📝 Création des données initiales...');

    // Créer les catégories
    try {
      await Category.bulkCreate([
        { name: 'Électronique', description: 'Appareils électroniques et gadgets' },
        { name: 'Accessoires', description: 'Accessoires pour téléphones et ordinateurs' },
        { name: 'Maison Connectée', description: 'Appareils pour la maison intelligente' },
        { name: 'Gaming', description: 'Consoles de jeux et accessoires' }
      ], { ignoreDuplicates: true });
    } catch (e) {
      console.log('ℹ️ Catégories déjà existantes');
    }

    // Créer les produits
    try {
      await Product.bulkCreate([
        {
          name: 'Smartphone Pro',
          description: 'Dernier smartphone avec écran AMOLED et 5G',
          price: 899.99,
          stock: 50,
          category_id: 1,
          image_url: '/images/products/smartphone.jpg',
          status: 'active',
          moderation_status: 'approved'
        },
        {
          name: 'Laptop Ultra',
          description: 'Ordinateur portable ultra-fin avec processeur dernière génération',
          price: 1299.99,
          stock: 25,
          category_id: 1,
          image_url: '/images/products/laptop.jpg',
          status: 'active',
          moderation_status: 'approved'
        },
        {
          name: 'Écouteurs Sans Fil',
          description: 'Écouteurs Bluetooth avec réduction de bruit',
          price: 199.99,
          stock: 100,
          category_id: 2,
          image_url: '/images/products/earbuds.jpg',
          status: 'active',
          moderation_status: 'approved'
        },
        {
          name: 'Montre Intelligente',
          description: 'Smartwatch avec suivi fitness et notifications',
          price: 299.99,
          stock: 75,
          category_id: 1,
          image_url: '/images/products/smartwatch.jpg',
          status: 'active',
          moderation_status: 'approved'
        },
        {
          name: 'Console de Gaming',
          description: 'Console de nouvelle génération avec 4K',
          price: 499.99,
          stock: 30,
          category_id: 4,
          image_url: '/images/products/console.jpg',
          status: 'active',
          moderation_status: 'approved'
        }
      ], { ignoreDuplicates: true });
    } catch (e) {
      console.log('ℹ️ Produits déjà existants');
    }

    // Approuver tous les produits existants pour qu'ils s'affichent publiquement
    try {
      await Product.update(
        { status: 'active', moderation_status: 'approved' },
        { where: {} }
      );
    } catch (e) {
      console.warn('⚠️ Erreur mise à jour statut produits:', e.message);
    }

    // Nettoyer les URLs d'images contenant localhost dans toutes les tables de la base de données
    const cleanupQueries = [
      `UPDATE products SET image_url = REGEXP_REPLACE(image_url, '^https?://localhost:[0-9]+', '') WHERE image_url LIKE '%localhost%'`,
      `UPDATE banners SET image = REGEXP_REPLACE(image, '^https?://localhost:[0-9]+', '') WHERE image LIKE '%localhost%'`,
      `UPDATE homepage_configs SET content = REGEXP_REPLACE(content::text, 'https?://localhost:[0-9]+', '', 'g')::jsonb WHERE content::text LIKE '%localhost%'`,
      `UPDATE stores SET "logoUrl" = REGEXP_REPLACE("logoUrl", '^https?://localhost:[0-9]+', '') WHERE "logoUrl" LIKE '%localhost%'`,
      `UPDATE stores SET "bannerUrl" = REGEXP_REPLACE("bannerUrl", '^https?://localhost:[0-9]+', '') WHERE "bannerUrl" LIKE '%localhost%'`,
      `UPDATE settings SET value = REGEXP_REPLACE(value, '^https?://localhost:[0-9]+', '') WHERE value LIKE '%localhost%'`
    ];

    for (const q of cleanupQueries) {
      try {
        await sequelize.query(q);
      } catch (e) {
        // Silently skip missing tables/columns
      }
    }
    console.log('🧹 Nettoyage complet des URLs localhost effectué dans la base de données');

    // Créer les utilisateurs
    try {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const defaultUsers = [
        { name: 'Admin User', email: 'admin@panyem.com', password: hashedPassword, role: 'admin' },
        { name: 'Jean Dupont', email: 'jean.dupont@example.com', password: hashedPassword, role: 'user' },
        { name: 'Marie Martin', email: 'marie.martin@example.com', password: hashedPassword, role: 'user' },
        { name: 'Pierre Durand', email: 'pierre.durand@example.com', password: hashedPassword, role: 'user' }
      ];
      for (const u of defaultUsers) {
        await User.findOrCreate({
          where: { email: u.email },
          defaults: u
        });
      }
    } catch (e) {
      console.log('ℹ️ Note création utilisateurs:', e.message);
    }

    const categoriesCount = await Category.count();
    const productsCount = await Product.count();
    const usersCount = await User.count();

    console.log('✅ Base de données initialisée et vérifiée avec succès !');
    console.log(`📊 ${categoriesCount} catégories dans la base de données`);
    console.log(`📦 ${productsCount} produits dans la base de données`);
    console.log(`👥 ${usersCount} utilisateurs dans la base de données`);
    console.log('');
    console.log('🔑 Comptes de test :');
    console.log('Admin: admin@panyem.com / password123');
    console.log('Client: jean.dupont@example.com / password123');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Initialisation terminée');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

export default initializeDatabase;
