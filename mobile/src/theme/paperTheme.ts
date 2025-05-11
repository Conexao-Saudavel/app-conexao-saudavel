// c:\Users\maced\Documents\Faculdade\2025.1\Machine Learning\Projetos\Conexão Saudavel\app-repo\mobile\src\theme\paperTheme.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { semanticColors } from './colors'; // Importa suas novas cores semânticas

export const paperTheme = {
  ...DefaultTheme,
  version: 3 as const, // Importante para temas MD3
  roundness: 8,    // Exemplo de arredondamento, ajuste como desejar
  colors: {
    ...DefaultTheme.colors, // Cores base do Paper que você pode não ter sobrescrito
    ...semanticColors,      // Suas cores semânticas com laranja, preto, cinzas
  },
  // Outras customizações de tema (fontes, etc.) podem vir aqui
  // Exemplo de configuração de fontes (requer `configureFonts` do Paper e um objeto de configuração de fontes):
  // fonts: configureFonts(fontConfig), 
};
