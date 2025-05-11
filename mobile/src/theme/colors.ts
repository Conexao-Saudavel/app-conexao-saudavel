// c:\Users\maced\Documents\Faculdade\2025.1\Machine Learning\Projetos\Conexão Saudavel\app-repo\mobile\src\theme\colors.ts

// Cores Base (Sua paleta Laranja, Preto, Cinzas)
const palette = {
  // Laranjas
  orange50: '#FFF3E0',  // Laranja bem claro
  orange100: '#FFE0B2', // Laranja claro
  orange300: '#FFB74D', // Laranja médio
  orange500: '#FF9800', // Laranja principal (pode ser seu primário)
  orange700: '#F57C00', // Laranja escuro
  orange900: '#E65100', // Laranja bem escuro

  // Pretos e Brancos
  black: '#000000',
  trueBlack: '#000000',
  white: '#FFFFFF',

  // Cinzas
  grey50: '#FAFAFA',    // Quase branco
  grey100: '#F5F5F5',   // Cinza muito claro
  grey200: '#EEEEEE',   // Cinza claro
  grey300: '#E0E0E0',   // Bordas, divisores
  grey400: '#BDBDBD',   // Texto secundário claro
  grey500: '#9E9E9E',   // Texto secundário, placeholders
  grey600: '#757575',   // Cinza médio
  grey700: '#616161',   // Texto principal em fundos claros (se não usar preto)
  grey800: '#424242',   // Fundos escuros, superfícies escuras
  grey900: '#212121',   // Quase preto, para texto em fundos muito claros ou como alternativa ao preto
};

// Cores Semânticas (Mapeadas para os nomes do React Native Paper e seus próprios usos)
export const semanticColors = {
  // Cores Primárias (Laranja como foco)
  primary: palette.orange500,
  onPrimary: palette.white, // Texto/ícones em cima do laranja primário
  primaryContainer: palette.orange100, // Um container com tom laranja claro
  onPrimaryContainer: palette.orange900, // Texto/ícones em cima do primaryContainer

  // Cores Secundárias (Cinza escuro para contraste)
  secondary: palette.grey800,
  onSecondary: palette.white,
  secondaryContainer: palette.grey300,
  onSecondaryContainer: palette.grey900,

  // Cores Terciárias
  tertiary: palette.orange700,
  onTertiary: palette.white,
  tertiaryContainer: palette.orange50,
  onTertiaryContainer: palette.orange900,

  // Cores de Erro
  error: '#B00020', // Vermelho padrão do Material Design para erro
  onError: palette.white,
  errorContainer: '#FADDD7', // Um rosa/vermelho claro
  onErrorContainer: '#410002', // Um vermelho bem escuro

  // Cores de Fundo e Superfície
  background: palette.grey100,    // Fundo principal do app (cinza bem claro)
  onBackground: palette.grey900,  // Texto principal em cima do fundo

  surface: palette.white,         // Fundo de cards, dialogs, menus (branco)
  onSurface: palette.grey900,     // Texto em cima de 'surface'
  surfaceVariant: palette.grey200,  // Uma variação de 'surface'
  onSurfaceVariant: palette.grey700, // Texto em cima de 'surfaceVariant'

  // Contornos e Divisores
  outline: palette.grey300,
  outlineVariant: palette.grey200,

  // Sombras e Scrim
  shadow: palette.black,
  scrim: palette.black,

  // Cores Invertidas
  inverseSurface: palette.grey900,
  inverseOnSurface: palette.grey50,
  inversePrimary: palette.orange300,

  // Elevação (MD3)
  elevation: {
    level0: 'transparent',
    level1: palette.white,
    level2: palette.white,
    level3: palette.white,
    level4: palette.white,
    level5: palette.white,
  },

  // Suas próprias cores semânticas personalizadas
  textPrimary: palette.grey900,
  textSecondary: palette.grey600,
  textDisabled: palette.grey400,
  border: palette.grey300,
  
  // Cores de Feedback adicionais
  success: '#2E7D32',
  onSuccess: palette.white,
  successContainer: '#C8E6C9',
  onSuccessContainer: '#1B5E20',

  warning: '#FF8F00',
  onWarning: palette.black,
  warningContainer: '#FFECB3',
  onWarningContainer: '#FF6F00',
};

export const basePalette = palette;
