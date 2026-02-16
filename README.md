# Documentation du Projet Gadget

Bienvenue dans la documentation du projet **Gadget**. Ce projet est une application web complète composée d'une interface client (Website) et d'une interface d'administration (Admin), soutenues par un backend Express et une base de données PostgreSQL.

## 📂 Structure du Projet

Le dossier racine contient deux sous-projets principaux :

*   **`gadgetzone_website`** : Le site web e-commerce destiné aux clients.
    *   **Technologie** : Vue.js 3, Vite, Tailwind CSS, Pinia.
    *   **Port par défaut** : Généralement `http://localhost:5173` (ou port disponible suivant).
*   **`gadgetzone_admin`** : Le panneau d'administration pour la gestion des produits, commandes et utilisateurs. Ce dossier contient également le **Backend API**.
    *   **Frontend Admin** : Vue.js 3, Vite, Tailwind CSS.
    *   **Backend API** : Node.js, Express, Sequelize (ORM), PostgreSQL.
    *   **Fichier d'entrée Backend** : `server.js`.

## 🧭 Pages et Fonctionnalités

### 1. GadgetZone Website (Client)
L'interface client permet aux utilisateurs de parcourir, acheter et gérer leur compte.

*   **Accueil (`/`)** : Vitrine principale avec bannières, catégories populaires et produits en vedette (`HomeView`).
*   **Produits** :
    *   **Liste (`/products`)** : Catalogue complet avec filtres et recherche (`ProductsView`).
    *   **Détail (`/products/:id`)** : Page produit individuelle avec description, images et options d'achat (`ProductDetailView`).
*   **Achats** :
    *   **Panier (`/cart`)** : Gestion des articles ajoutés (`CartView`).
    *   **Commande (`/checkout`)** : Processus de paiement final (`CheckoutView`).
    *   **Liste d'envies (`/wishlist`)** : Produits sauvegardés par l'utilisateur (`WishlistView`).
*   **Compte Utilisateur** :
    *   **Tableau de bord (`/account`)** : Vue d'ensemble du profil (`AccountView`).
    *   **Commandes (`/orders`)** : Historique et suivi des achats (`OrdersView`, `OrderDetailView`).
    *   **Adresses (`/addresses`)** : Gestion des adresses de livraison (`AddressesView`).
*   **Pages Statiques** : À Propos, Contact, FAQ, Confidentialité.

### 2. GadgetZone Admin (Gestion)
Le panneau d'administration est divisé en modules fonctionnels accessibles via le menu latéral.

*   **Tableau de bord (`/`)** : Vue d'ensemble avec statistiques clés (Ventes, Visiteurs, Commandes) (`Ecommerce.vue`).
*   **Clients (`/clients`)** :
    *   Liste complète des clients inscrits.
    *   Détails de chaque client avec historique des commandes.
*   **Commandes (`/commandes`)** :
    *   Gestion complète du cycle de vie des commandes (En cours, Livrées, Annulées).
    *   Détails techniques d'une commande spécifique.
*   **Produits (`/liste-produits`, `/ajouter-produit`)** :
    *   CRUD complet (Créer, Lire, Mettre à jour, Supprimer) des produits.
    *   Gestion des stocks, prix, images et catégories.
*   **Autres Modules** :
    *   **Finance (`/finance`)** : Rapports financiers.
    *   **Marketing** : Gestion des campagnes, newsletters et promotions.
    *   **Support** : Gestion des tickets et FAQ.
    *   **Utilisateurs & Rôles** : Gestion des accès administrateurs.
    *   **Paramètres** : Configuration générale du site et de la sécurité.

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

*   **Node.js** (v20+ recommandé)
*   **PostgreSQL** (pour la base de données)
*   **Git**

## 🚀 Installation et Démarrage

Il est nécessaire d'installer les dépendances pour chaque dossier séparément.

### 1. Installation

**Pour le Site Web :**
```bash
cd gadgetzone_website
npm install
```

**Pour l'Admin et le Backend :**
```bash
cd gadgetzone_admin
npm install
```

### 2. Démarrage (Développement)

Pour travailler sur le projet, vous devrez souvent lancer les trois parties : le backend, l'admin (optionnel selon le besoin) et le site web.

#### Démarrer le Backend + Admin (depuis `gadgetzone_admin`)
```bash
cd gadgetzone_admin
# Lance le backend ET le frontend admin en parallèle
npm run dev:full
```
*   Cela lance le serveur API (généralement sur le port 3000 ou 5000, voir `.env`) et l'interface Admin via Vite.

*   **Commandes alternatives utiles :**
    *   `npm run dev:backend` : Lance uniquement le serveur API (avec nodemon pour le rechargement automatique).
    *   `npm run dev` : Lance uniquement le frontend Admin.

#### Démarrer le Site Web (depuis `gadgetzone_website`)
```bash
cd gadgetzone_website
npm run dev
```

## 👩‍💻 Guide de Développement : Ajouter une Fonctionnalité

Voici les étapes générales pour ajouter une nouvelle fonctionnalité complète (ex: "Gestion des Promotions").

### Étape 1 : Backend (API & Base de Données)
Travailler dans `gadgetzone_admin`.

1.  **Modèle de Données (Sequelize)** :
    *   Ajouter ou modifier un modèle dans `src/backend/models` (ou dossier similaire s'il existe, sinon vérifier la config Sequelize).
2.  **Routes API** :
    *   Créer de nouvelles routes dans `src/backend/routes` (ou directement dans `server.js` si l'app est petite, mais il est recommandé de séparer).
    *   Assurez-vous que les routes sont sécurisées si nécessaire (middleware d'authentification).
3.  **Contrôleurs** :
    *   Ajouter la logique métier pour traiter les requêtes API.

### Étape 2 : Frontend (Admin ou Website)
Travailler dans `gadgetzone_admin` ou `gadgetzone_website` selon le besoin.

1.  **Store (Pinia)** :
    *   Créer ou mettre à jour un store dans `src/stores` pour gérer l'état (ex: `usePromotionStore`).
    *   Ajouter les actions pour appeler votre nouvelle API (via Axios).
2.  **Composants UI** :
    *   Créer des composants Vue réutilisables dans `src/components`.
3.  **Pages (Views)** :
    *   Créer la nouvelle page dans `src/views`.
    *   Ajouter la route correspondante dans `src/router/index.ts` (ou `.js`).

## 🗄️ Gestion de la Base de Données

Les scripts suivants sont disponibles dans le dossier `gadgetzone_admin` pour gérer la BDD :

*   `npm run init:database` : Initialise la base de données.
*   `npm run seed:database` : Remplit la base avec des données de test (seed).
*   `npm run seed:orders` : Ajoute des commandes de test spécifiques.
*   `npm run debug:api` : Script utile pour déboguer les connexions API.

## 📝 Notes Importantes

*   **Fichiers `.env`** : Assurez-vous que les fichiers `.env` sont correctement configurés dans chaque dossier pour les variables d'environnement (URL de la BDD, clés API, etc.).
*   **Ports** : Si vous rencontrez des erreurs "EADDRINUSE", vérifiez qu'aucun autre processus n'utilise les ports par défaut (souvent 3000, 5000, 5173).
