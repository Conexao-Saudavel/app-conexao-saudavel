// Configurações da API
export const API_CONFIG = {
  // URL base da API - Railway
  BASE_URL: 'https://server-conexao-saudavel-production.up.railway.app',
  
  // Endpoints de autenticação
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  
  // Endpoints de sincronização
  SYNC: {
    USAGE_DATA: '/api/sync/usage-data',
    EVENTS: '/api/sync/events',
  },
  
  // Endpoints de usuário
  USER: {
    PROFILE: '/api/user/profile',
    SETTINGS: '/api/user/settings',
  },
  
  // Timeout padrão para requisições (em ms)
  TIMEOUT: 10000,
};

// Função para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Configurações para diferentes ambientes
export const ENV_CONFIG = {
  development: {
    BASE_URL: 'http://10.0.2.2:3000', // Para desenvolvimento local
  },
  production: {
    BASE_URL: 'https://server-conexao-saudavel-production.up.railway.app',
  },
};

// Função para obter a URL base baseada no ambiente
export const getBaseUrl = (): string => {
  const env = __DEV__ ? 'development' : 'production';
  return ENV_CONFIG[env].BASE_URL;
}; 