import React, { createContext, useContext, useState } from 'react';
import { removeTokens } from '../services/storage/tokenStorage';
import CredentialStorage from '../services/storage/credentialStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
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
  
  const login = () => setIsAuthenticated(true);
  
  const logout = async () => {
    try {
      // Limpar tokens
      await removeTokens();
      
      // Limpar credenciais salvas (opcional - você pode decidir se quer manter ou não)
      // await CredentialStorage.clearCredentials();
      
      setIsAuthenticated(false);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setIsAuthenticated(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 