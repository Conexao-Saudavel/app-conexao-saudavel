#!/bin/bash

# Script específico para o Railway que ignora o build do backend
# e foca apenas na parte mobile/web

echo "=== INICIANDO BUILD APENAS DO FRONTEND ==="

# Navega para a pasta mobile
cd mobile

# Instala dependências
echo "Instalando dependências do frontend..."
npm install

# Executa o build do frontend web
echo "Construindo a versão web..."
npm run web:build

echo "=== BUILD DO FRONTEND CONCLUÍDA ==="

# Volta para a raiz do projeto
cd ..

# Cria a pasta para o artefato final, se não existir
mkdir -p dist

# Copia os arquivos construídos para a pasta dist do projeto principal
# para que o Railway encontre os arquivos estáticos
echo "Copiando arquivos para diretório de deploy..."
cp -r mobile/dist/web/* dist/

echo "=== PROCESSO CONCLUÍDO ==="