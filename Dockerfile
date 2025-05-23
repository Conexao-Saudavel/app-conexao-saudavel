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
FROM node:18-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar os arquivos de build
COPY --from=builder /app/dist ./dist

# Expor a porta 3000 (porta padrão do serve)
EXPOSE 3000

# Iniciar o servidor diretamente
CMD ["serve", "-s", "dist", "-l", "3000"]    