FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copia só os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Compila o código (se necessário)
RUN npm run build

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando de inicialização (ajuste se for produção)
CMD ["npm", "run", "dev"]
