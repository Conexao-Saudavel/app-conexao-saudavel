# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./
COPY app.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto do código
COPY . .

# Build da aplicação web com otimizações
ENV NODE_ENV=production
RUN npm run build:web

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração básica do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Script de inicialização simplificado
RUN echo '#!/bin/sh\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Usar o script de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"]    