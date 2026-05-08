# Étape 1 : Build
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Injection de l'URL de l'API pour le site client
# manage.htfasil.com est le domaine de l'API
ENV VITE_API_URL=https://manage.htfasil.com/api

RUN npm run build-only

# Étape 2 : Serveur Nginx
FROM nginx:stable-alpine

# Copie des fichiers buildés
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Ajout de la config Nginx pour SPA (gestion des routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
