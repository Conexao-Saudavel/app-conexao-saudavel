#!/bin/bash

# Certifica-se de que o arquivo Dockerfile.mobile existe
cat > Dockerfile.mobile << 'EOL'
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos da pasta mobile
COPY mobile/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da pasta mobile
COPY mobile/ ./

# Expõe a porta usada pelo webpack-dev-server
EXPOSE 8080

# Comando para iniciar o servidor de desenvolvimento web
CMD ["npm", "run", "web:dev", "--", "--host", "0.0.0.0", "--port", "8080"]
EOL

# Executa a aplicação web apenas (sem o backend)
echo "Iniciando a aplicação web do Conexão Saudável..."
docker-compose -f docker-compose.mobile.yml up --build

# Obs: Para parar a aplicação, pressione Ctrl+C
