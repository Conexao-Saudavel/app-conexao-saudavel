# Conexão Saudável

Aplicativo mobile voltado ao controle da dependência digital entre estudantes universitários.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- React Native
- Jest
- ESLint
- Prettier
- Winston (Logging)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Conexao-Saudavel/conexao-saudavel.git
cd conexao-saudavel
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Execute as migrações do banco de dados:
```bash
npm run migration:run
```

## 🚀 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🧪 Testes

```bash
# Executa todos os testes
npm test

# Executa os testes com cobertura
npm test -- --coverage
```

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em modo produção
- `npm test`: Executa os testes
- `npm run lint`: Verifica o código com ESLint
- `npm run lint:fix`: Corrige problemas de linting
- `npm run format`: Formata o código com Prettier
- `npm run migration:generate`: Gera uma nova migração
- `npm run migration:run`: Executa as migrações pendentes
- `npm run migration:revert`: Reverte a última migração

## 📁 Estrutura do Projeto

```
src/
├── api/
│   ├── controllers/
│   │   ├── auth/
│   │   ├── user/
│   │   └── monitoring/
│   ├── middlewares/
│   │   ├── auth/
│   │   ├── error/
│   │   └── validation/
│   ├── routes/
│   └── services/
│       ├── auth/
│       └── user/
├── core/
│   ├── config/
│   ├── errors/
│   └── types/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── entities/
├── utils/
│   ├── logger/
│   ├── validators/
│   └── helpers/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## 📝 Logging

O projeto utiliza Winston para gerenciamento de logs com as seguintes características:

### Níveis de Log
- error: Erros críticos
- warn: Avisos importantes
- info: Informações gerais
- http: Requisições HTTP
- debug: Informações de debug

### Destinos de Log
- Console (colorido)
- Arquivo de erros (`logs/error.log`)
- Arquivo de todos os logs (`logs/all.log`)

### Uso do Logger
```typescript
import { logError, logInfo, logWarning, logDebug, logHttp } from './utils/logger';

// Exemplo de uso
logInfo('Operação concluída', { userId: '123' });
logError(new Error('Erro de autenticação'), 'AuthService');
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

