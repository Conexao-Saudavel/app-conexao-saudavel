// App.tsx
import React, { createContext, useContext, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import IconComponent from 'react-native-vector-icons/MaterialCommunityIcons'; // Renomeado para IconComponent para clareza
import { NavigationContainer } from '@react-navigation/native';
// Importe seus navegadores aqui
import MainNavigator from './navigation/MainNavigator'; // Exemplo
import { paperTheme } from './theme/paperTheme';

// Para depuração, vamos ver o que é o IconComponent importado:
console.log('IconComponent from react-native-vector-icons/MaterialCommunityIcons:', IconComponent);
console.log('typeof IconComponent:', typeof IconComponent);

// Tentar acessar .default se IconComponent for um objeto com uma propriedade default
const ActualIconComponent = (typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent && (IconComponent as any).$$typeof === Symbol.for('react.element')))
  ? IconComponent // Se já for um componente React válido
  : (IconComponent && (IconComponent as any).default) || IconComponent; // Tenta .default, senão usa o próprio IconComponent

console.log('ActualIconComponent to be used by PaperProvider:', ActualIconComponent);
console.log('typeof ActualIconComponent:', typeof ActualIconComponent);

// Contexto de autenticação
const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <PaperProvider
      theme={paperTheme}
      settings={{
        icon: (props) => <ActualIconComponent {...props} />, // Usar ActualIconComponent
      }}
    >
      <AuthProvider>
        <NavigationContainer>
          {/* Seus navegadores, ex: <AuthNavigator /> ou <MainNavigator /> */}
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;