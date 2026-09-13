import { Product } from '../models/index.js';
import { Op } from 'sequelize';

export async function repairProductDescriptions() {
    try {
        const emptyProducts = await Product.findAll({
            where: {
                [Op.or]: [
                    { description: null },
                    { description: '' }
                ]
            }
        });

        if (emptyProducts.length === 0) return;

        console.log(`[RepairDescriptions] Correction de ${emptyProducts.length} produits sans description...`);
        for (const product of emptyProducts) {
            const defaultDesc = `${product.name} - Produit disponible sur Panyem avec livraison rapide et garantie.`;
            await product.update({ description: defaultDesc });
        }
        console.log(`[RepairDescriptions] ✅ ${emptyProducts.length} descriptions corrigées.`);
    } catch (error) {
        console.error('[RepairDescriptions] ❌ Erreur lors de la correction des descriptions:', error.message);
    }
}
