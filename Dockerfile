# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências globais necessárias
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./
COPY app.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto do código
COPY . .

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV EXPO_NO_DOTENV=1

# Build da aplicação web
RUN npx expo export

# Verificar se os arquivos foram gerados
RUN ls -la dist

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar os arquivos de build do estágio anterior
COPY --from=builder /app/dist ./dist

# Expor a porta 3000 (porta padrão do serve)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["serve", "-s", "dist", "-l", "3000"] 