# 🛒 Projet htfasil : Extension Marketplace (Multi-Vendeurs)

Ce document définit la stratégie technique et fonctionnelle pour transformer l'application htfasil en une plateforme marketplace où des tiers peuvent vendre leurs produits.

## 🏗️ Architecture du Système

Le projet repose sur une architecture à trois niveaux de permissions :

1.  **Super Admin** (Contrôle total, validation des vendeurs, commissions).
2.  **Vendeur (Seller)** (Gestion de son propre inventaire, de ses commandes et de son profil boutique).
3.  **Client (Customer)** (Achat, suivi de commandes, demande d'ouverture de boutique).

## 📊 Tableau de Charge & Jalons (Milestones)

| Phase | Priorité | Tâches Backend (API & DB) | Tâches Frontend (Admin/Web) |
| :--- | :--- | :--- | :--- |
| **Phase 1 : Data** | 🔴 | Migration Users (Rôles) + Création Modèle Stores | UI : Formulaire "Devenir Vendeur" sur le Website |
| **Phase 2 : Auth** | 🔴 | Middleware de Protection par Rôle (RBAC) | Admin : Logique de redirection selon le rôle au Login |
| **Phase 3 : Isolation** | 🟠 | Filtrage des requêtes SQL par store_id | Admin : Filtrage des vues (Produits/Commandes) |
| **Phase 4 : Boutique** | 🟡 | API de gestion du profil Boutique (CRUD) | Admin : Page "Ma Boutique" (Logo, Description) |
| **Phase 5 : Ventes** | 🟠 | Split des commandes (Multi-vendeurs) | Website : Affichage "Vendu par [Nom]" sur les produits |

## ⚙️ Modifications Techniques Requises

### 1. Base de Données (Sequelize)

Nous devons passer d'une relation directe Admin -> Produit à une relation Vendeur -> Boutique -> Produit.

*   **Table Users** : Ajouter `role` (ENUM: 'ADMIN', 'SELLER', 'CUSTOMER').
*   **Table Stores** : Nouvelle table liée à Users (One-to-One).
*   **Table Products** : Ajouter `storeId` (Foreign Key).

### 2. Sécurité & API

Toutes les routes de `htfasil_admin` doivent être protégées.

*   **Middleware `isSeller`** : Vérifie si l'utilisateur possède une boutique active.
*   **Scopes Sequelize** : Utiliser des "scopes" pour que `Product.findAll()` ne retourne que les produits du vendeur connecté par défaut.

## 🚀 Flux Utilisateur : "Devenir Vendeur"

1.  **Candidature** : Un client remplit un formulaire sur `htfasil_website` (Nom de boutique, documents légaux).
2.  **Validation** : Le Super Admin reçoit une notification dans son dashboard et valide le compte.
3.  **Activation** : Le role de l'utilisateur devient `SELLER`.
4.  **Accès** : L'utilisateur se connecte à `htfasil_admin`. Son menu est filtré : il ne voit pas les réglages globaux du site, uniquement ses ventes.

## 📝 Conventions de Développement

*   **Isolation** : Ne jamais modifier une donnée qui n'appartient pas au `storeId` de la session.
*   **Routes API** : Préfixer les routes vendeurs par `/api/v1/vendor/...` pour les distinguer des routes admin globales.
*   **Composants Vue** : Réutiliser les composants de `htfasil_admin` (tableaux, formulaires) en leur passant des filtres dynamiques.

## 🛠️ Prochaines étapes immédiates

1.  **Backend** : Exécuter la migration pour ajouter les rôles et la table `Stores`.
2.  **Backend** : Mettre à jour le contrôleur d'authentification pour inclure le `role` dans le token JWT.
3.  **Frontend Admin** : Créer le Sidebar dynamique qui affiche/cache des onglets selon le rôle.
