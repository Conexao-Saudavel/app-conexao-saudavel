import { logError, logInfo, logWarning, logDebug, logHttp } from './index';

// Exemplo de uso do logger em diferentes contextos

// Logging de erro
try {
  throw new Error('Erro de exemplo');
} catch (error) {
  logError(error as Error, 'Contexto do erro');
}

// Logging de informação
logInfo('Operação concluída com sucesso', {
  userId: '123',
  action: 'create',
  resource: 'user',
});

// Logging de aviso
logWarning('Recurso quase esgotado', {
  resource: 'memory',
  usage: '85%',
});

// Logging de debug
logDebug('Estado atual do sistema', {
  memory: process.memoryUsage(),
  uptime: process.uptime(),
});

// Logging de requisição HTTP
logHttp('Requisição recebida', {
  method: 'POST',
  path: '/api/users',
  duration: 150,
}); 