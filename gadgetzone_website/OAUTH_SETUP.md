# Configuration OAuth - HTFasil

## Variables d'environnement requises

Créez un fichier `.env` à la racine de `htfasil_website` avec les clés suivantes :

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=votre_google_client_id

# Facebook OAuth  
VITE_FACEBOOK_APP_ID=votre_facebook_app_id
```

## Étapes pour configurer OAuth

### 1. Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ 
4. Allez dans "Identifiants" → "Créer des identifiants" → "ID client OAuth 2.0"
5. Configurez l'écran de consentement OAuth
6. Ajoutez les URI de redirection autorisées :
   - `http://localhost:5174/auth/google/callback`
   - `https://votre-domaine.com/auth/google/callback`
7. Copiez le "Client ID" dans votre fichier `.env`

### 2. Facebook OAuth

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez le produit "Facebook Login"
4. Dans les paramètres de Facebook Login, ajoutez les URI de redirection :
   - `http://localhost:5174/auth/google/callback`
   - `https://votre-domaine.com/auth/facebook/callback`
5. Copiez l'"App ID" dans votre fichier `.env`

### 3. Backend (À implémenter)

Vous devrez créer des endpoints dans votre backend pour :

- `/auth/google/callback` - Gérer le callback Google
- `/auth/facebook/callback` - Gérer le callback Facebook

Ces endpoints doivent :
1. Recevoir le code d'autorisation
2. Échanger le code contre un access token
3. Récupérer les informations utilisateur
4. Créer ou connecter l'utilisateur dans votre base de données
5. Retourner un JWT pour votre application

## Note

Les boutons sont maintenant fonctionnels et redirigeront vers Google/Facebook OAuth une fois que vous aurez configuré les clés API.
