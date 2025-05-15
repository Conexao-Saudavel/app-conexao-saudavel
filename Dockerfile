FROM node:18-alpine

# Ignora o build do backend e foca apenas no frontend (mobile)
WORKDIR /app

# Copia APENAS o que precisamos da parte mobile
COPY mobile/package*.json ./
COPY mobile/webpack.config.js ./
COPY mobile/babel.config.js ./
COPY mobile/tsconfig.json ./
COPY mobile/index.web.js ./
COPY mobile/index.web.html ./
COPY mobile/src ./src
COPY mobile/public ./public

# Instala as dependências apenas da parte mobile
RUN npm install

# Configura a variável de ambiente PORT para o Railway
ENV PORT=8080

# Compila o aplicativo web para produção
RUN npm run web:build

# Instala um servidor web simples para servir o conteúdo estático
RUN npm install -g serve

# Expõe a porta usada pela aplicação web
EXPOSE 8080

# Comando para iniciar o servidor web em produção no Railway
CMD serve -s dist/web -l ${PORT}