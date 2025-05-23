// c:\Users\maced\Documents\Faculdade\2025.1\Machine Learning\Projetos\Conexão Saudavel\app-repo\mobile\src\theme\colors.ts

// Cores Base (paleta inspirada no design)
export const palette = {
  // Fundo geral
  backgroundMain: '#FFF8F2', // Bege/creme muito claro

  // Azul dos cards de tempo de uso
  usageCardGradientStart: '#CFE8F5', // Azul claro (topo do gradiente)
  usageCardGradientEnd: '#A3D3F7',   // Azul claro (base do gradiente)
  usageIconBlue: '#4A90E2',          // Azul médio do ícone

  // Lilás dos cards de gráficos
  purpleLight: '#C6B6F3', // Lilás claro (fundo do card)
  purpleDark: '#8A6FC7',  // Lilás escuro (ícone/texto)

  // Verde dos cards de diário
  greenLight: '#C6E3C4', // Verde claro (fundo do card)
  greenDark: '#3A6B4B',  // Verde escuro (ícone/texto)

  // Laranja dos cards de metas e botões
  orangeLight: '#FFE0B2', // Laranja claro (fundo do card)
  orangeDark: '#E65100',  // Laranja escuro (texto)
  orangeButton: '#FF9800', // Laranja forte (botão)

  // Cinza azulado para input
  inputBg: '#F0F4F8', // Cinza azulado muito claro

  // Pretos e brancos
  black: '#23272F', // Preto/cinza escuro para textos
  white: '#FFFFFF',
  blueStrong: '#3B4FE4', // Azul forte para destaque

  // Laranjas
  orange50: '#FFF3E0',  // Laranja bem claro
  orange100: '#FFE0B2', // Laranja claro
  orange300: '#FFB74D', // Laranja médio
  orange500: '#FF9800', // Laranja principal (pode ser seu primário)
  orange700: '#F57C00', // Laranja escuro
  orange900: '#E65100', // Laranja bem escuro

  // Azuis (Novas cores)
  blue50: '#F0F8FF',    // Azul bem claro (fundo principal)
  blue100: '#DCEFF8',   // Azul claro (fundo secundário)
  blue200: '#CFE8F5',   // Azul médio
  blueDark: '#1E3A8A',  // Azul escuro (texto)

  // Lilás (Novas cores)
  purpleDark: '#5B4B8A',  // Lilás escuro (texto dos cards)

  // Pretos e Brancos
  trueBlack: '#000000',

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

// Novo semanticColors baseado no palette atualizado
export const semanticColors = {
  // Fundo principal do app
  background: palette.backgroundMain,
  onBackground: palette.black,

  // Cards principais
  primary: palette.usageIconBlue,
  onPrimary: palette.white,
  primaryContainer: palette.usageCardGradientStart,
  onPrimaryContainer: palette.black,

  // Cards secundários
  secondary: palette.purpleDark,
  onSecondary: palette.white,
  secondaryContainer: palette.purpleLight,
  onSecondaryContainer: palette.purpleDark,

  // Cards de sucesso/verde
  success: palette.greenDark,
  onSuccess: palette.white,
  successContainer: palette.greenLight,
  onSuccessContainer: palette.greenDark,

  // Cards de aviso/laranja
  warning: palette.orangeDark,
  onWarning: palette.white,
  warningContainer: palette.orangeLight,
  onWarningContainer: palette.orangeDark,

  // Cards de erro (mantendo vermelho padrão)
  error: '#B00020',
  onError: palette.white,
  errorContainer: '#FADDD7',
  onErrorContainer: '#410002',

  // Superfície (cards brancos)
  surface: palette.white,
  onSurface: palette.black,
  surfaceVariant: palette.inputBg,
  onSurfaceVariant: palette.black,

  // Texto
  textPrimary: palette.black,
  textSecondary: palette.purpleDark,
  textDisabled: '#BDBDBD',
  border: palette.usageCardGradientEnd,
};
