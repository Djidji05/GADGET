# 🛒 Projet GadgetZone - Marketplace Complète

Bienvenue dans l'écosystème **GadgetZone**. Ce projet est une solution e-commerce robuste comprenant une plateforme client, un tableau de bord d'administration et un backend API haute performance.

## 📂 Architecture du Système

Le projet est divisé en deux piliers principaux :

1.  **`gadgetzone_website`** : Interface client (Frontend).
    *   **Tech** : Vue.js 3, Vite, Tailwind CSS, Pinia.
    *   **URL** : `http://localhost:5173`
2.  **`gadgetzone_admin`** : Dashboard Admin + **Serveur Backend**.
    *   **Tech** : Express.js, Sequelize, PostgreSQL, Redis, BullMQ.
    *   **API URL** : `http://localhost:3003/api`
    *   **Admin Dashboard URL** : `http://localhost:5173` (ou port suivant si lancé avec le site).

---

## 🚀 Installation Rapide

### 1. Prérequis
*   **Node.js** (v20+)
*   **PostgreSQL** (Base de données `gadgetzone`)
*   **Redis** (Optionnel, pour les files d'attente d'emails)

### 2. Installation des dépendances
```bash
# Dans gadgetzone_website
npm install

# Dans gadgetzone_admin
npm install
```

### 3. Configuration de la Base de Données
Dans `gadgetzone_admin`, configurez votre `.env.backend` et lancez :
```bash
npm run init:database
npm run seed:database
```

---

## 💳 Intégration MonCash (Sandbox)

Le système de paiement MonCash est configuré pour le mode Sandbox.

### Configuration du Portail MonCash
Pour que l'intégration fonctionne, saisissez ces URLs sur votre compte développeur MonCash :
*   **Alert Url** : `https://VOTRE_URL_NGROK.ngrok-free.app/api/webhooks/moncash`
*   **Return Url** : `http://localhost:5173/payment/success`

### Utilisation de ngrok (Webhooks)
Comme MonCash doit envoyer des notifications à votre machine locale, vous devez utiliser **ngrok** :
1.  Lancez le tunnel : `npx ngrok http 3003`
2.  Copiez l'URL `Forwarding`.
3.  Mettez à jour `notify_url` dans `src/backend/services/moncash.service.js`.

### Identifiants API
Assurez-vous d'avoir les bonnes clés dans `gadgetzone_admin/.env.backend` :
```env
MONCASH_CLIENT_ID=votre_client_id
MONCASH_CLIENT_SECRET=votre_secret_key
```

---

## 🛠️ Commandes de Développement

### Lancer tout le système
Dans `gadgetzone_admin` :
```bash
npm run dev:full
```
Dans `gadgetzone_website` :
```bash
npm run dev
```

### Maintenance Backend
*   `npm run dev:backend` : Relance uniquement le serveur API.
*   `npm run test` : Lance la suite de tests Jest.

---

## ⚡ Optimisations de Performance

Nous avons appliqué plusieurs optimisations pour garantir la fluidité du système :
*   **Timeouts harmonisés** : Le backend et le frontend sont configurés avec un timeout de **45 secondes** pour gérer les requêtes MonCash et les recherches complexes.
*   **Indexation SQL** : Les tables `orders`, `messages` et `conversations` sont indexées pour des recherches instantanées.
*   **Gestion des Erreurs** : Sentry est intégré au backend pour le monitoring en temps réel.

---

## 📝 Troubleshooting (En cas de problème)

*   **Erreur 500 MonCash** : Vérifiez que vos clés API sont bien des clés de développement (et non vos identifiants de connexion). Redémarrez le backend après modification.
*   **Something's broken** (Portail MonCash) : Utilisez des URLs valides (ex: google.com) temporairement pour pouvoir sauvegarder vos configurations sur leur site.
*   **Recherche lente** : Assurez-vous que Meilisearch est bien lancé si vous l'utilisez pour l'indexation globale.

---
*Projet développé avec passion pour la performance et l'expérience utilisateur.*
