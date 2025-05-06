import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './api/middlewares/errorHandler';
import { rateLimiter } from './api/middlewares/rateLimiter';
import routes from './api/routes';

// Carrega variáveis de ambiente
config();

// Inicializa o Express
const app = express();

// Middlewares básicos
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Rotas da API
app.use('/api', routes);

// Tratamento de erros
app.use(errorHandler);

// Inicializa o servidor
const PORT = process.env.PORT || 3000;

// Inicializa o banco de dados e inicia o servidor
AppDataSource.initialize()
  .then(() => {
    console.log('Banco de dados conectado com sucesso');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }); 