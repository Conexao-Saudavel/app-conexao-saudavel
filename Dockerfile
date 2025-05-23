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

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar os arquivos de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do nginx com otimizações
RUN echo 'server { \
    listen 80 default_server; \
    listen [::]:80 default_server; \
    server_name _; \
    \
    # Configurações de log \
    access_log /dev/stdout; \
    error_log /dev/stderr debug; \
    \
    # Configurações de gzip \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    gzip_comp_level 6; \
    gzip_min_length 1000; \
    \
    # Configurações de cache \
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ { \
        expires 1y; \
        add_header Cache-Control "public, no-transform"; \
    } \
    \
    # Configuração principal \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header X-Debug-Path $request_filename; \
        add_header X-Debug-Uri $uri; \
    } \
    \
    # Healthcheck endpoint \
    location = /health { \
        access_log off; \
        add_header Content-Type text/plain; \
        return 200 "healthy\n"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Verificar se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Criar script de inicialização com healthcheck
RUN echo '#!/bin/sh\n\
echo "Verificando configuração do nginx..."\n\
nginx -t\n\
if [ $? -ne 0 ]; then\n\
    echo "Erro na configuração do nginx"\n\
    exit 1\n\
fi\n\
echo "Iniciando nginx..."\n\
nginx -g "daemon off; error_log /dev/stderr debug;" &\n\
echo "Aguardando nginx iniciar..."\n\
sleep 2\n\
echo "Verificando se nginx está respondendo..."\n\
curl -f http://localhost/health || exit 1\n\
echo "Nginx iniciado com sucesso!"\n\
wait\n\
' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Usar o script de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"] 