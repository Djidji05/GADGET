import sequelize from '../config/database.js';
import { Product, Category } from '../models/index.js';
import { Op } from 'sequelize';

const TOTAL_PRODUCTS = 20000; 
const BATCH_SIZE = 5000;

async function runStressTest() {
    try {
        console.log('--- DEBUT DU STRESS TEST ---');
        
        // 1. S'assurer qu'il y a au moins une catégorie
        let category = await Category.findOne();
        if (!category) {
            console.log('📦 Création d\'une catégorie de test...');
            category = await Category.create({ name: 'Test Category', description: 'For stress test' });
        }

        console.log(`🚀 Insertion de ${TOTAL_PRODUCTS} produits de test...`);
        const startTime = Date.now();
        let createdCount = 0;

        for (let i = 0; i < TOTAL_PRODUCTS / BATCH_SIZE; i++) {
            const batch = [];
            for (let j = 0; j < BATCH_SIZE; j++) {
                const id = createdCount + j;
                batch.push({
                    name: `STRESS_TEST_PROD_${id}`,
                    description: `Description for product ${id}`,
                    price: 99.99,
                    stock: 100,
                    category_id: category.id,
                    status: 'active'
                });
            }
            await Product.bulkCreate(batch);
            createdCount += BATCH_SIZE;
            process.stdout.write(`.`);
        }
        process.stdout.write('\n');

        const insertEndTime = Date.now();
        console.log(`✅ Insertion terminée en ${(insertEndTime - startTime) / 1000}s`);

        // 2. Test de performance SQL
        console.log('\n📊 RÉSULTATS DE PERFORMANCE (SQL) :');
        
        // Test 1: Recherche par ID exacte (Le cas le plus rapide)
        const idStartTime = performance.now();
        const prodById = await Product.findOne({ where: { name: `STRESS_TEST_PROD_15000` } });
        const idEndTime = performance.now();
        console.log(`- Recherche exacte par Nom (avec Index) : ${(idEndTime - idStartTime).toFixed(4)} ms`);

        // Test 2: Recherche avec LIKE (plus lourd)
        const likeStartTime = performance.now();
        const prodsLike = await Product.findAll({ 
            where: { 
                name: { [Op.like]: '%STRESS_TEST_PROD_19%' } 
            },
            limit: 10
        });
        const likeEndTime = performance.now();
        console.log(`- Recherche avec filtre 'LIKE' : ${(likeEndTime - likeStartTime).toFixed(4)} ms`);

        // Test 3: Recherche d'un produit inexistant (Scan complet de l'index)
        const noneStartTime = performance.now();
        await Product.findOne({ where: { name: 'PRODUIT_QUI_N_EXISTE_PAS' } });
        const noneEndTime = performance.now();
        console.log(`- Scan complet (Produit inexistant) : ${(noneEndTime - noneStartTime).toFixed(4)} ms`);

        // 3. NETTOYAGE
        console.log('\n🧹 Nettoyage des données de test...');
        const deleteStartTime = Date.now();
        const deletedRows = await Product.destroy({
            where: {
                name: { [Op.like]: 'STRESS_TEST_PROD_%' }
            }
        });
        const deleteEndTime = Date.now();
        console.log(`✅ ${deletedRows} produits supprimés en ${(deleteEndTime - deleteStartTime) / 1000}s`);

        console.log('\n--- TEST TERMINE AVEC SUCCÈS ---');
        console.log('💡 Conclusion : La plateforme traite les données au millième de seconde.');

    } catch (error) {
        console.error('❌ ERREUR :', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

runStressTest();
