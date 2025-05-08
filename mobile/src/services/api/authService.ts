import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterFormData } from '../../types/auth'; // Assumindo que você tem este tipo de RegisterScreen.tsx

// ----- Tipos -----
// Payload para o endpoint de login
export interface LoginPayload {
  email: string;
  password: string;
}

// Resposta esperada do endpoint de login
export interface LoginResponse {
  userId: string;
  token: string;
  fullName: string;
  email: string;
  // Adicione quaisquer outros dados do usuário que sua API retorna no login
}

// Payload para o endpoint de cadastro (ajuste conforme sua API)
// A RegisterFormData já inclui fullName, email, password.
// A API pode não precisar de confirmPassword ou acceptTerms.
export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

// Resposta esperada do endpoint de cadastro
export interface RegisterResponse {
  userId: string;
  message: string; // Ex: "Usuário criado com sucesso."
  // Sua API pode retornar o usuário criado ou um token já no cadastro
  // token?: string;
  // user?: { fullName: string; email: string; };
}

const USER_TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'userData';

// ----- Funções de Serviço -----

/**
 * Realiza o login do usuário.
 * @param credentials - Email e senha do usuário.
 * @returns Promise com os dados do usuário e token.
 */
export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    // Endpoint da sua API para login (ex: /auth/login)
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    if (response.data && response.data.token) {
      // Salvar o token e os dados do usuário no AsyncStorage
      await AsyncStorage.setItem(USER_TOKEN_KEY, response.data.token);
      // Salvar outros dados do usuário se necessário (opcional, pode vir do perfil)
      const userDataToStore = {
          userId: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
      };
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userDataToStore));
    }
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de login:', error);
    // O interceptor de resposta já deve ter formatado o erro
    throw error;
  }
};

/**
 * Realiza o cadastro de um novo usuário.
 * @param userData - Dados do formulário de cadastro.
 * @returns Promise com a resposta da API de cadastro.
 */
export const register = async (userData: RegisterFormData): Promise<RegisterResponse> => {
  try {
    // Adapte o payload conforme o que sua API de cadastro espera.
    // Geralmente não se envia 'confirmPassword' ou 'acceptTerms'.
    const payload: RegisterPayload = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
    };

    // Endpoint da sua API para cadastro (ex: /users ou /auth/register)
    const response = await apiClient.post<RegisterResponse>('/auth/register', payload);

    // Se a API retornar um token já no cadastro, você pode salvá-lo aqui também
    // if (response.data.token) {
    //   await AsyncStorage.setItem(USER_TOKEN_KEY, response.data.token);
    // }
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de registro:', error);
    throw error;
  }
};

/**
 * Realiza o logout do usuário.
 * Limpa o token e os dados do usuário do AsyncStorage.
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    // Você pode querer chamar um endpoint de logout na API aqui, se existir,
    // para invalidar o token no lado do servidor.
    // Ex: await apiClient.post('/auth/logout');
    console.log('Usuário deslogado, token removido.');
  } catch (error) {
    console.error('Erro no serviço de logout:', error);
    throw error; // Ou trate de forma diferente, pois o logout no cliente já ocorreu
  }
};

/**
 * Obtém o token do usuário armazenado.
 * @returns O token do usuário ou null se não existir.
 */
export const getUserToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter token do usuário:', error);
    return null;
  }
};

/**
 * Obtém os dados do usuário armazenado.
 * @returns Os dados do usuário ou null se não existirem.
 */
export const getUserData = async (): Promise<LoginResponse | null> => {
    try {
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userDataString) {
        return JSON.parse(userDataString) as LoginResponse;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  };

// Você pode adicionar mais funções aqui, como:
// - requestPasswordReset(email: string)
// - resetPassword(token: string, newPassword: string)
// - verifyEmail(token: string)
// - getCurrentUserProfile() -> poderia ser em um userService.ts separado