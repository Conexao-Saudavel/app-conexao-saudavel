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

// Regex para validar a complexidade da senha
const passwordValidationRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^<>(){}[\]:;.,+\-\\])[A-Za-z\d@$!%*?&_#^<>(){}[\]:;.,+\-\\]{6,}$/
);

// Regex para um formato de e-mail mais robusto
const emailValidationRegex = new RegExp(
  /^[a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
);

// Schema de validação com Zod atualizado
const registrationSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  email: z.string()
    .min(1, { message: 'E-mail é obrigatório' })
    // .email({ message: 'Formato de e-mail inválido' }) // A regex abaixo é mais completa
    .regex(emailValidationRegex, { message: 'Formato de e-mail inválido ou não parece ser de um domínio real' })
    // Exemplo de validação de domínio "confiável" (use com cautela):
    // .refine(email => {
    //   const trustedDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
    //   const domain = email.split('@')[1];
    //   return trustedDomains.includes(domain?.toLowerCase());
    // }, { message: 'Por favor, use um e-mail de um provedor conhecido.' })
    ,
  password: z.string()
    .min(1, { message: 'Senha é obrigatória' })
    // .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }) // A regex já impõe o mínimo
    .regex(passwordValidationRegex, {
      message: 'A senha deve ter no mín. 6 caracteres, com maiúscula, minúscula, número e caractere especial',
    }),
  confirmPassword: z.string()
    .min(1, { message: 'Confirmação de senha é obrigatória' }),
  acceptTerms: z.boolean().refine(value => value === true, {
    message: 'Você deve aceitar os Termos de Uso e a Política de Privacidade',
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

  const handleFormSubmit = (data: RegisterFormData) => {
    onSubmit(data);
  };

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
        onPress={handleSubmit(handleFormSubmit)}
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