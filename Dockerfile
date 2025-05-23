# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./

# Instalar dependências
RUN npm ci

# Copiar o resto do código
COPY . .

# Build da aplicação web
RUN npm run build:web

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build do estágio anterior
COPY --from=builder /app/web-build /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"] 