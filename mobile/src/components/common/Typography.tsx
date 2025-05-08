// src/components/common/Typography.tsx
import React from 'react';
import { Text as PaperText, TextProps as PaperTextPropsBase, useTheme } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

// Defina as variantes que você pretende usar. Estas são da documentação do RNP v5.
// Você pode adicionar ou remover conforme sua necessidade.
export type AppVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall';

// A interface PaperTextPropsBase é genérica. Vamos especificar o tipo da variante.
interface TypographyProps extends Omit<PaperTextPropsBase<React.ReactNode>, 'variant' | 'children' | 'theme'> {
  children: React.ReactNode;
  variant?: AppVariant; // Usamos nosso tipo AppVariant aqui
  style?: StyleProp<TextStyle>;
  // Se você quiser permitir passar outras props específicas do PaperText,
  // pode precisar estender mais, mas para um componente Typography básico, isso é geralmente suficiente.
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'bodyMedium', // Default variant
  style,
  ...props
}) => {
  const theme = useTheme(); // Opcional, se você precisar acessar o tema diretamente

  return (
    <PaperText
      variant={variant}
      style={style}
      theme={theme} // Passando o tema explicitamente ou deixe o PaperProvider lidar com isso
      {...props}
    >
      {children}
    </PaperText>
  );
};

export default Typography;