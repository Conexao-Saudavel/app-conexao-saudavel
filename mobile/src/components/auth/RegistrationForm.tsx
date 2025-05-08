// src/components/auth/RegistrationForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RegisterFormData } from '../../types/auth';
import InputField from '../common/InputField';
import Button from '../common/Button';
import TermsCheckbox from './TermsCheckbox';
// import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator'; // Se for usar

// Schema de validação com Zod
const registrationSchema = z.object({
    fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres'),
    acceptTerms: z.boolean().refine(value => value === true, {
        message: 'Você deve aceitar os termos e condições',
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Indica qual campo mostrar o erro
});

interface RegistrationFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  onTermsPress: () => void;
  onPolicyPress: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading,
  onTermsPress,
  onPolicyPress,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch // Para o PasswordStrengthIndicator
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const passwordValue = watch('password'); // Observa o valor da senha

  return (
    <View style={styles.container}>
      <InputField
        name="fullName"
        control={control}
        label="Nome Completo"
        error={errors.fullName}
        autoCapitalize="words"
      />
      <InputField
        name="email"
        control={control}
        label="Email"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <InputField
        name="password"
        control={control}
        label="Senha"
        error={errors.password}
        secureTextEntry
      />
      {/* Opcional: PasswordStrengthIndicator
      {passwordValue && <PasswordStrengthIndicator password={passwordValue} />}
      */}
      <InputField
        name="confirmPassword"
        control={control}
        label="Confirmar Senha"
        error={errors.confirmPassword}
        secureTextEntry
      />
      <TermsCheckbox
        name="acceptTerms"
        control={control}
        error={errors.acceptTerms}
        onTermsPress={onTermsPress}
        onPolicyPress={onPolicyPress}
      />
      <Button
        title="Cadastrar"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
});

export default RegistrationForm;