import { Product, Category, Order, OrderItem, Setting } from '../models/index.js';
import { Op } from 'sequelize';
import GeminiService from '../services/GeminiService.js';
import SearchService from '../services/SearchService.js';

class AIController {
    /**
     * Gère les messages entrants du chat avec Gemini et Meilisearch
     */
    static async handleChat(req, res) {
        try {
            const { message, history } = req.body;
            const userId = req.user?.id;

            if (!message) {
                return res.status(400).json({ error: 'Message requis' });
            }

            // 1. Détecter l'intention avec Gemini (ou fallback manuel simple)
            const intent = await GeminiService.detectIntent(message);
            
            let responseText = "";
            let data = null;

            // 2. Traitement selon l'intention
            if (intent === 'product_search') {
                // Recherche intelligente via Meilisearch
                const searchTerms = message.toLowerCase().replace(/(cherche|trouve|les|des|un|une|le|la|prix|combien|coûte|look for|find|search)/g, '').trim();
                
                const searchResults = await SearchService.search(searchTerms, { status: 'active' }, { limit: 5 });
                
                if (searchResults && searchResults.hits.length > 0) {
                    const products = searchResults.hits;
                    const geminiResp = await GeminiService.generateResponse(
                        `L'utilisateur cherche: "${message}". J'ai trouvé ces produits: ${products.map(p => p.name).join(', ')}. Présente-les brièvement.`,
                        history
                    );
                    responseText = geminiResp.message;
                    data = { type: 'products', items: products.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image_url: p.image_url
                    })) };
                } else {
                    const geminiResp = await GeminiService.generateResponse(
                        `L'utilisateur cherche "${message}" mais aucun produit n'a été trouvé. Réponds poliment en anglais ou français selon sa langue.`,
                        history
                    );
                    responseText = geminiResp.message;
                }
            } 
            else if (intent === 'order_status') {
                if (!userId) {
                    responseText = (await GeminiService.generateResponse("L'utilisateur demande le statut d'une commande mais n'est pas connecté. Explique-lui qu'il doit se connecter.", history)).message;
                } else {
                    const latestOrder = await Order.findOne({
                        where: { user_id: userId },
                        order: [['created_at', 'DESC']],
                        include: [{ model: OrderItem, as: 'items', include: ['product'] }]
                    });

                    if (latestOrder) {
                        const statusColor = latestOrder.status === 'delivered' ? 'Livrée' : 'En cours';
                        const prompt = `L'utilisateur demande pour sa commande. La dernière commande est la #${latestOrder.id} au statut ${latestOrder.status}. Montant: ${latestOrder.total_amount} G. Réponds-lui de manière personnalisée.`;
                        responseText = (await GeminiService.generateResponse(prompt, history)).message;
                        data = { type: 'order', item: latestOrder };
                    } else {
                        responseText = (await GeminiService.generateResponse("L'utilisateur n'a aucune commande. Réponds poliment.", history)).message;
                    }
                }
            }
            else {
                // Chat général ou Info vendeur
                const geminiResp = await GeminiService.generateResponse(message, history);
                responseText = geminiResp.message;
            }

            res.json({
                message: responseText,
                data: data,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('[AI Controller] Error:', error);
            res.status(500).json({ error: 'Erreur interne de l\'assistant' });
        }
    }

    /**
     * Fournit des suggestions de questions contextuelles
     */
    static async getSuggestions(req, res) {
        const suggestions = [
            "Quels sont les derniers ordinateurs ?",
            "Find me a gaming mouse",
            "Où est ma commande ?",
            "Comment devenir vendeur sur HTFasil ?",
        ];
        res.json(suggestions);
    }

    /**
     * Assistant IA dédié aux VENDEURS - coach business multilingue
     */
    static async handleSellerChat(req, res) {
        try {
            const { message, history } = req.body;
            const userId = req.user?.id;

            if (!message) {
                return res.status(400).json({ error: 'Message requis' });
            }

            // Manuel interne complet HTFasil pour l'IA vendeur
            const sellerContext = `Tu es l'assistant privé et exclusif des VENDEURS de HTFasil, une marketplace en Haïti.
Tu es un expert du commerce en ligne et un coach business qui parle Français, Créole Haïtien et Anglais.
Tu dois TOUJOURS répondre dans la langue du vendeur.

=== MANUEL INTERNE HTFASIL - CONFIDENTIEL ===

## 1. COMMISSIONS ET FRAIS
- Appareils électroniques (téléphones, laptops, tablettes, accessoires tech, etc.): 5,5% sur chaque vente
- Toutes les autres catégories (vêtements, alimentation, maison, beauté, sport, etc.): 3,5% sur chaque vente
- AUCUN frais d'inscription pour devenir vendeur
- AUCUN abonnement mensuel
- Les commissions sont prélevées automatiquement à chaque transaction réussie
- Exemple: Un laptop vendu à 50 000 G → HTFasil garde 2 750 G (5,5%) → Vendeur reçoit 47 250 G

## 2. PAIEMENTS ET RETRAITS
- Méthode de paiement acceptée: MonCash (principal)
- Les fonds sont disponibles après confirmation de livraison par l'acheteur
- Voir les revenus en temps réel dans: /seller/transactions et /seller/payments
- Pour les dépôts et retraits: /seller/deposits

## 3. NAVIGATION DE LA PLATEFORME
- TABLEAU DE BORD: /seller/dashboard - vue globale des ventes et statistiques
- AJOUTER PRODUIT: /seller/products/new - formulaire complet avec photos, prix, stock, description
- MES PRODUITS: /seller/products - liste, modifier ou désactiver des produits
- COMMANDES REÇUES: /seller/orders - accepter, préparer, marquer comme livrée
- PAIEMENTS: /seller/payments et /seller/transactions - suivi complet des revenus
- PROMOTIONS: /seller/promotions - créer codes promo et offres spéciales
- BOOSTER: /seller/boost - payer pour avoir plus de visibilité en tête de liste
- PARAMÈTRES BOUTIQUE: /seller/settings - modifier nom, logo, description, coordonnées
- ACADÉMIE: /seller/academy - formations gratuites pour vendre plus
- RAPPORTS: /seller/reports - analyses de performance détaillées
- MESSAGES: /seller/messages - communiquer avec les acheteurs
- MON QR CODE: /seller/my-qr - partager sa boutique facilement
- AIDE: /seller/help - centre d'aide officiel

## 4. COMMENT AJOUTER UN PRODUIT (Étapes)
1. Ale nan /seller/products/new
2. Mete non pwodwi a (clair et précis)
3. Chwazi kategori a (important pour le bon taux de commission)
4. Mete pri a an Goud (HTG)
5. Ajoute foto pwodwi yo (minimum 1, maximum 10)
6. Ekri yon bon deskripsyon
7. Mete kantite stock la
8. Klike "Publie" - Pwodwi a ap parèt nan boutik la touswit

## 5. RÈGLES IMPORTANTES DE LA PLATEFORME
- Tout produit doit avoir une photo réelle (pas d'images volées sur internet)
- Les prix doivent être en Goud Haïtien (HTG)
- Interdiction de vendre des produits contrefaits ou illégaux
- Répondre aux commandes dans les 48 heures maximum
- En cas de litige avec un acheteur, HTFasil tranche la décision finale
- Les comptes avec trop de mauvaises critiques peuvent être suspendus

## 6. AVANTAGES VENDEUR HTFASIL
- Accès à des milliers de clients potentiels en Haïti
- Tableau de bord professionnel avec statistiques en temps réel
- Support client dédié aux vendeurs
- Formation gratuite via HTFasil Academy
- QR Code personnalisé pour partager sa boutique hors ligne
- Système de promotions intégré

=== FIN DU MANUEL INTERNE ===

Règles de réponse:
1. Sois direct et pratique. Donne des étapes claires et numérotées.
2. Indique toujours le chemin exact de la page concernée (ex: "Ale nan /seller/products/new").
3. Encourage le vendeur, sois positif et motivant.
4. Si une question porte sur les commissions, réponds toujours avec les chiffres EXACTS ci-dessus.
5. Si tu ne sais pas quelque chose de spécifique, oriente vers /seller/help.
6. RÈGLE DE SÉCURITÉ ABSOLUE : Si le vendeur demande comment pirater, frauder, arnaquer des clients, accéder illégalement à des données, ou toute activité malveillante — REFUSE CATÉGORIQUEMENT et clairement dans sa langue. Explique que c'est IMPOSSIBLE et ILLÉGAL, que HTFasil surveille toutes les activités frauduleuses, et que son compte vendeur sera immédiatement suspendu et signalé. Ne donne AUCUNE information technique, même partielle.

Message du vendeur: ${message}`;

            const geminiResp = await GeminiService.generateResponse(sellerContext, history);

            res.json({
                message: geminiResp.message,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('[AI Seller Controller] Error:', error);
            res.status(500).json({ error: "Erreur de l'assistant vendeur" });
        }
    }
}

export default AIController;
