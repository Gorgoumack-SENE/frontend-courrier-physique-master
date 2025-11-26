# Stage 1 : build Angular
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Utiliser le script build:prod défini dans package.json
RUN npm run build:prod

# Stage 2 : Nginx pour servir l'application
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
