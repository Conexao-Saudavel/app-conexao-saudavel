import { MD3LightTheme as DefaultTheme } from 'react-native-paper'; // ou MD3DarkTheme

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4', // accent não é mais usado diretamente no RNP v5, mas pode ser útil para seus componentes
    background: '#f6f6f6',
    // ... outras cores personalizadas
  },
};