# Plan de Transformation : Gadget Business (Marketplace)

Ce document décrit la feuille de route pour transformer **GadgetZone** d'une boutique simple en une **Marketplace Multi-vendeurs** appelée "Gadget Business".

## 🎯 Objectif
Permettre aux utilisateurs de s'inscrire en tant que vendeurs ("Gadget Business"), de créer leur propre boutique et de vendre n'importe quel type de produit sur la plateforme.

## 🏗️ Architecture des Changements

### 1. Base de Données (PostgreSQL / Sequelize)

Pour supporter la **Buy Box** (plusieurs vendeurs sur un même produit), il faut séparer le "Produit Catalogue" de "l'Offre Vendeur".

#### [NEW] Modèle `Store` (Boutique)
- `id`: PK
- `owner_id`: FK vers `Users`
- `rating`: Float (Note moyenne du vendeur, critique pour la Buy Box)

#### [MODIFY] Modèle `Product` (Le Catalogue)
- **Devient la référence globale** (ex: "iPhone 15 128Go Noir").
- Ne contient plus le `stock` ni le `price` final.
- Contient les infos communes : `name`, `description`, `images`, `specs`.

#### [NEW] Modèle `Offer` (L'Offre Vendeur)
- `id`: PK
- `product_id`: FK vers `Product`
- `store_id`: FK vers `Store`
- `price`: Le prix de CE vendeur.
- `stock`: Le stock de CE vendeur.
- `condition`: 'new', 'used', etc.
- `shipping_days`: Délai de livraison estimé (facteur Buy Box).

### 2. Backend API (`gadgetzone_admin`)

#### [NEW] Algorithme Buy Box (Service)
Lorsqu'on récupère un produit (`GET /products/:id`), le backend doit déterminer "L'offre gagnante" (Buy Box Winner) parmi toutes les `Offers`.
**Critères simplifiés :**
1.  **Prix** (Le plus bas est favorisé).
2.  **Stock** (Doit être > 0).
3.  **Note du Vendeur** (Un vendeur mal noté perd la Buy Box même s'il est moins cher).
4.  **Délai de livraison** (Plus court = mieux).

#### [NEW] Routes Vendeurs
- `POST /products/:id/offers` : Un vendeur ajoute SON offre sur un produit existant ("Vendre le vôtre").

### 3. Frontend : GadgetZone Website

#### [MODIFY] Page Produit (`/products/:id`)
- **Zone Principale (Buy Box)** : Affiche le prix et le bouton "Ajouter au panier" de l'offre gagnante.
- **Mention** : "Vendu par [Gagnant] et expédié par GadgetZone".
- **Liste Secondaire** : "Autres vendeurs sur GadgetZone" (liste les autres offres pour ce produit, classées par prix).

#### [MODIFY] Page d'accueil / Liste
- Affiche le prix "à partir de" (prix de la Buy Box).

#### [MODIFY] Pages Produits (`/products`)
- **Catalogue Unifié** : La page `/products` doit afficher par défaut les produits de **tous les vendeurs** (Marketplace globale).
- **Carte Produit** : Ajouter "Vendu par : [Nom de la Boutique]" directement sur la carte du produit dans la liste.
- **Filtres** : Ajouter un filtre "Vendeur" pour permettre de ne voir que les produits d'une boutique spécifique.
- **Fiche Détail** : Cliquer sur le nom du vendeur mène à la page de la boutique (`/store/:id`).

#### [MODIFY] Navigation (`AppNavbar.vue` & `MobileCategories.vue`)
- **Structure par Groupes** : Pour ne pas surcharger la barre horizontale avec l'ajout de "Vêtements", "Maison", etc., nous allons regrouper les catégories :
    - **Électronique** (Smartphones, Laptops, Audio, Gaming, Photo...)
    - **Mode** (Vêtements Homme/Femme, Chaussures, Accessoires...)
    - **Maison** (Déco, Cuisine, Meubles...)
    - **Beauté & Santé**
- **Design Preservé** : Utilisation des mêmes dropdowns et icônes que le site actuel, juste réorganisés.

#### [MODIFY] Système de Catégories
- Rendre le menu dynamique pour supporter "N'importe quel produit" (pas juste électronique).

### 4. Frontend : GadgetZone Admin (Super Admin)

- Ajouter une section **Gestion des Vendeurs**.
- Pouvoir valider/bloquer des boutiques.
- Voir toutes les ventes globales.

---

## 📅 Étapes de Réalisation Recommandées

1.  **Backend - Modèles** : Créer `Store.js` et mettre à jour `Product.js`.
2.  **Backend - API** : Créer les routes d'inscription vendeur et d'ajout de produit lié au vendeur.
3.  **Frontend - Inscription** : Créer la page `/business/register`.
4.  **Frontend - Dashboard** : Créer l'interface de gestion de produits pour le vendeur.
5.  **Frontend - Public** : Mettre à jour l'affichage produit pour montrer le vendeur.
