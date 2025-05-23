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

# Iniciar o nginx diretamente
CMD ["nginx", "-g", "daemon off;"]    