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

# Build da aplicação web
RUN npm run build:web

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do nginx com logs detalhados
RUN echo 'server { \
    listen 80; \
    access_log /dev/stdout; \
    error_log /dev/stderr debug; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
        add_header X-Debug-Path $request_filename; \
        add_header X-Debug-Uri $uri; \
    } \
    \
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

# Iniciar o nginx com logs detalhados
CMD ["nginx", "-g", "daemon off; error_log /dev/stderr debug;"] 