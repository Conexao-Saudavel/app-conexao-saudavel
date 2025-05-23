// App.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importe seus navegadores aqui
import MainNavigator from './src/navigation/MainNavigator';
import { paperTheme } from './src/theme/paperTheme';

// Mantenha a splash screen visível enquanto carregamos recursos
SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded, fontError] = useFonts({
    // Adicione suas fontes customizadas aqui se necessário
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <PaperProvider
        theme={paperTheme}
        settings={{
          icon: (props) => <MaterialCommunityIcons {...props} />,
        }}
      >
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;