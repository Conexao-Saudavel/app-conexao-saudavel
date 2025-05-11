import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para gerenciar tokens

// Substitua pela URL base da sua API backend
// Em desenvolvimento, pode ser algo como 'http://localhost:3000/api/v1'
// Em produção, será o domínio da sua API real
const API_BASE_URL = 'https://sua-api-de-backend.com/api/v1'; // <-- MUDE ISSO

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Você pode adicionar outros cabeçalhos padrão aqui, se necessário
    // 'X-App-Version': '1.0.0',
  },
  timeout: 10000, // Timeout de 10 segundos para as requisições
});

// ----- Interceptador de Requisição -----
// Usado para adicionar o token de autenticação a cada requisição, se disponível
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Erro ao obter token do AsyncStorage no interceptor:', e);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Erro no interceptor de requisição Axios:', error);
    return Promise.reject(error);
  }
);

// ----- Interceptador de Resposta -----
// Usado para tratamento global de erros de API
apiClient.interceptors.response.use(
  (response) => {
    // Qualquer status code dentro do range de 2xx causa essa função ser trigada
    // Não faça nada aqui, apenas retorne a resposta
    return response;
  },
  (error: AxiosError) => {
    // Qualquer status code que caia fora do range de 2xx causa essa função ser trigada
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status code
      // que cai fora do range de 2xx
      console.error('API Error [Response Data]:', error.response.data);
      console.error('API Error [Status]:', error.response.status);
      console.error('API Error [Headers]:', error.response.headers);

      if (error.response.status === 401) {
        // Exemplo: Lógica para deslogar o usuário se o token for inválido/expirado
        // Isso pode envolver limpar o AsyncStorage e navegar para a tela de Login.
        // Você precisaria de acesso ao seu sistema de navegação ou a um dispatcher de estado (Redux, etc.)
        console.warn('Erro 401: Não autorizado. Implementar lógica de logout/redirect.');
        // Exemplo:
        // await AsyncStorage.removeItem('userToken');
        // navigation.navigate('Login'); // Isso precisa ser feito de forma mais centralizada
      }

      // Retorna um objeto de erro mais padronizado, pegando a mensagem do backend se existir
      const errorMessage = (error.response.data as { message?: string })?.message ||
                           error.message ||
                           'Ocorreu um erro desconhecido na API.';
      return Promise.reject(new Error(errorMessage));

    } else if (error.request) {
      // A requisição foi feita mas nenhuma resposta foi recebida
      // `error.request` é uma instância de XMLHttpRequest no browser e uma instância de
      // http.ClientRequest no node.js
      console.error('API Error [No Response]:', error.request);
      return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique sua internet.'));
    } else {
      // Algo aconteceu ao configurar a requisição que acionou um erro
      console.error('API Error [Request Setup]:', error.message);
      return Promise.reject(new Error('Erro ao configurar a requisição para a API.'));
    }
  }
);

export default apiClient;