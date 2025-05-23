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
FROM nginx:alpine

# Copiar os arquivos de build do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificar se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"] 