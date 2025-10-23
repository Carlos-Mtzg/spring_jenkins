# 1 - Recursos
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm@latest-10
RUN pnpm install

COPY . .

# Desde el Docker Compose
ARG API_HOST
ARG API_PORT
ARG API_BASE

# Para reemplazar en el .env del proyecto
ENV VITE_API_HOST=$API_HOST
ENV VITE_API_PORT=$API_PORT
ENV VITE_API_BASE=$API_BASE

RUN pnpm run build

# 2 - Imagen
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
