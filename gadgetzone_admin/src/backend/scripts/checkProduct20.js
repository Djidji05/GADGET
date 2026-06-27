import { initDatabase } from '../config/database.js';
import { Product } from '../models/index.js';

const checkProduct = async () => {
  try {
    const connected = await initDatabase();
    if (!connected) {
      console.error('❌ Connexion échouée');
      return;
    }
    
    console.log('🔍 Recherche du produit avec ID = 20...');
    const product = await Product.findByPk(20);
    if (!product) {
      console.log('❌ Produit 20 non trouvé dans la base de données !');
      // Trouvons d'autres produits à titre indicatif
      const anyProducts = await Product.findAll({ limit: 5 });
      console.log('📦 Exemples d\'autres produits dans la base de données :');
      anyProducts.forEach(p => {
        console.log(`  - ID: ${p.id}, Nom: "${p.name}", Statut: "${p.status}", Moderation: "${p.moderation_status}"`);
      });
    } else {
      console.log('✅ Produit 20 trouvé !');
      console.log(JSON.stringify(product.toJSON(), null, 2));
    }
  } catch (error) {
    console.error('❌ Erreur :', error.message);
  } finally {
    process.exit(0);
  }
};

checkProduct();
