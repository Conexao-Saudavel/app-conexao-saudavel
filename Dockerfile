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

# Instalar curl (useful for debugging)
RUN apk add --no-cache curl

# Copiar os arquivos de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do Nginx
RUN printf '%s\n' \
    'server { \' \
    '    listen 80 default_server; \' \
    '    listen [::]:80 default_server; \' \
    '    server_name _; \' \
    '    access_log /dev/stdout; \' \
    '    error_log /dev/stderr debug; \' \
    '    gzip on; \' \
    '    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \' \
    '    gzip_comp_level 6; \' \
    '    gzip_min_length 1000; \' \
    '    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ { \' \
    '        expires 1y; \' \
    '        add_header Cache-Control "public, no-transform"; \' \
    '    } \' \
    '    root /usr/share/nginx/html; \' \
    '    index index.html; \' \
    '    location / { \' \
    '        try_files $uri $uri/ /index.html; \' \
    '        add_header X-Debug-Path $request_filename; \' \
    '        add_header X-Debug-Uri $uri; \' \
    '    } \' \
    '    location = /health { \' \
    '        access_log off; \' \
    '        add_header Content-Type text/plain; \' \
    '        return 200 "healthy\\n"; \' \
    '    } \' \
    '}' > /etc/nginx/conf.d/default.conf

# Verificar se os arquivos foram copiados corretamente (optional)
RUN ls -la /usr/share/nginx/html

EXPOSE 80

# Criar script de inicialização usando printf
# CORRECTED SCRIPT CREATION (removed problematic '' lines for linter):
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'echo "Verificando configuração do nginx..."' \
    'NGINX_TEST_OUTPUT=$(nginx -t 2>&1)' \
    'NGINX_TEST_EXIT_CODE=$?' \
    'echo "--- Nginx Configuration Test Output (Exit Code: $NGINX_TEST_EXIT_CODE) ---"' \
    'echo "$NGINX_TEST_OUTPUT"' \
    'echo "--- End Nginx Configuration Test Output ---"' \
    'if [ $NGINX_TEST_EXIT_CODE -ne 0 ]; then' \
    '    echo "Erro na configuração do nginx (código de saída: $NGINX_TEST_EXIT_CODE). Saindo."' \
    '    exit 1' \
    'else' \
    '    echo "Configuração Nginx OK."' \
    'fi' \
    'echo "Iniciando nginx em foreground..."' \
    '# Use exec to replace the shell process with Nginx' \
    'exec nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Usar o script de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"]