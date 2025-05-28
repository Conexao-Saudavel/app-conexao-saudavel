// src/components/common/Typography.tsx
import React from 'react';
import { Text as PaperText, TextProps as PaperTextPropsBase, useTheme } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

// Variantes oficiais do Material Design 3
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
  variant?: AppVariant;
  style?: StyleProp<TextStyle>;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'bodyMedium', // Default variant
  style,
  ...props
}) => {
  return (
    <PaperText
      variant={variant}
      style={style}
      {...props}
    >
      {children}
    </PaperText>
  );
};

export default Typography;