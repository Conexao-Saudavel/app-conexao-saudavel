import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessToken, removeTokens } from '../services/storage/tokenStorage';

interface AuthContextData {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Checa se já existe token salvo ao iniciar o app
    const checkToken = async () => {
      const token = await getAccessToken();
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  const signIn = () => {
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await removeTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 