// App.tsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
// Importe seus navegadores aqui
import MainNavigator from './navigation/MainNavigator'; // Exemplo
import { paperTheme } from './theme/paperTheme';

const App = () => {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        {/* Seus navegadores, ex: <AuthNavigator /> ou <MainNavigator /> */}
        <MainNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;