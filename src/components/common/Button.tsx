// src/components/common/Button.tsx
import React from 'react';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';

interface ButtonProps extends Omit<PaperButtonProps, 'children'> {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title, ...props }) => {
  return (
    <PaperButton mode="contained" {...props}>
      {title}
    </PaperButton>
  );
};

export default Button;