import React, { createContext, useContext, useState, useEffect } from 'react';
import { removeTokens } from '../services/storage/tokenStorage';
import CredentialStorage from '../services/storage/credentialStorage';
import { getUserData } from '../services/api/authService';

interface UserData {
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  user_type: string;
  avatar_url?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: () => void;
  logout: () => void;
  loadUserData: () => Promise<void>;
  updateUserData: (data: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: null,
  login: () => {},
  logout: () => {},
  loadUserData: async () => {},
  updateUserData: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const login = () => setIsAuthenticated(true);
  
  const logout = async () => {
    try {
      // Limpar tokens
      await removeTokens();
      
      // Limpar dados do usuário
      setUserData(null);
      
      setIsAuthenticated(false);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setIsAuthenticated(false);
    }
  };

  const loadUserData = async () => {
    try {
      if (isAuthenticated) {
        console.log('AuthContext: Carregando dados do usuário...');
        const data = await getUserData();
        console.log('AuthContext: Dados carregados com sucesso:', data);
        setUserData(data);
      }
    } catch (error) {
      console.error('AuthContext: Erro ao carregar dados do usuário:', error);
      // Não vamos mostrar alerta aqui, apenas logar o erro
      // O componente pode tratar o erro como quiser
    }
  };

  const updateUserData = (data: UserData) => {
    setUserData(data);
  };

  // Carregar dados do usuário quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData, 
      login, 
      logout, 
      loadUserData, 
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 