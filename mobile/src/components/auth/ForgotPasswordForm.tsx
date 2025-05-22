import React from 'react';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Typography from '../common/Typography';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { isValid } } = useForm<ForgotPasswordFormValues>({
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const handleSend = (data: ForgotPasswordFormValues) => {
    onSubmit(data.email);
  };

  return (
    <>
      <Typography variant="bodyMedium" style={styles.subtitle}>
        Informe seu e-mail cadastrado para receber as instruções de recuperação de senha.
      </Typography>
      <InputField
        name="email"
        control={control}
        label="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        rules={{
          required: 'E-mail obrigatório',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'E-mail inválido',
          },
        }}
      />
      <Button
        title={isLoading ? 'Enviando...' : 'Enviar'}
        onPress={handleSubmit(handleSend)}
        disabled={isLoading || !isValid}
        style={styles.button}
      />
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
  },
});

export default ForgotPasswordForm; 