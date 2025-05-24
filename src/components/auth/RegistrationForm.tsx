// src/components/auth/RegistrationForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Modal } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RegisterFormData } from '../../types/auth';
import InputField from '../common/InputField';
import Button from '../common/Button';
import TermsCheckbox from './TermsCheckbox';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Typography from '../common/Typography';
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
  gender: z.string().min(1, { message: 'Gênero é obrigatório' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  userType: z.string().min(1, { message: 'Tipo de usuário é obrigatório' }),
  iesId: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'], // Indica qual campo mostrar o erro
}).refine(data => {
  if (data.userType === 'Aluno') {
    return !!data.iesId && data.iesId.length > 0;
  }
  return true;
}, {
  message: 'ID da IES é obrigatório para alunos',
  path: ['iesId'],
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showUserTypePicker, setShowUserTypePicker] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      gender: '',
      birthDate: '',
      userType: '',
    },
  });

  const passwordValue = watch('password');
  const genderValue = watch('gender');
  const birthDateValue = watch('birthDate');
  const userTypeValue = watch('userType');

  const handleFormSubmit = (data: RegisterFormData) => {
    onSubmit(data);
  };

  const handleGenderSelect = (gender: string) => {
    setValue('gender', gender);
    setShowGenderPicker(false);
  };

  const handleUserTypeSelect = (userType: string) => {
    setValue('userType', userType);
    setShowUserTypePicker(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toLocaleDateString('pt-BR');
      setValue('birthDate', formattedDate);
    }
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
      
      {/* Campo de Tipo de Usuário */}
      <View style={styles.fieldContainer}>
        <TouchableOpacity onPress={() => setShowUserTypePicker(true)}>
          <TextInput
            label="Tipo de Usuário"
            value={userTypeValue}
            editable={false}
            right={<TextInput.Icon icon="chevron-down" />}
            error={!!errors.userType}
            style={styles.input}
            mode="outlined"
          />
        </TouchableOpacity>
        <Modal
          visible={showUserTypePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUserTypePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowUserTypePicker(false)}
          >
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerItem} 
                onPress={() => handleUserTypeSelect('Independente')}
              >
                <Typography variant="bodyMedium">Independente</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.pickerItem} 
                onPress={() => handleUserTypeSelect('Institucional')}
              >
                <Typography variant="bodyMedium">Institucional</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.pickerItem} 
                onPress={() => handleUserTypeSelect('Aluno')}
              >
                <Typography variant="bodyMedium">Aluno</Typography>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        {errors.userType && (
          <Typography variant="bodySmall" style={[styles.errorText, { color: 'red' }]}>
            {errors.userType.message}
          </Typography>
        )}
      </View>

      {/* Campo de ID da IES (apenas para alunos) */}
      {userTypeValue === 'Aluno' && (
        <View style={styles.fieldContainer}>
          <InputField
            name="iesId"
            control={control}
            label="ID da IES"
            error={errors.iesId}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>
      )}

      {/* Campo de Gênero */}
      <View style={styles.fieldContainer}>
        <TouchableOpacity onPress={() => setShowGenderPicker(true)}>
          <TextInput
            label="Gênero"
            value={genderValue}
            editable={false}
            right={<TextInput.Icon icon="chevron-down" />}
            error={!!errors.gender}
            style={styles.input}
            mode="outlined"
          />
        </TouchableOpacity>
        <Modal
          visible={showGenderPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGenderPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowGenderPicker(false)}
          >
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerItem} 
                onPress={() => handleGenderSelect('Masculino')}
              >
                <Typography variant="bodyMedium">Masculino</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.pickerItem} 
                onPress={() => handleGenderSelect('Feminino')}
              >
                <Typography variant="bodyMedium">Feminino</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.pickerItem} 
                onPress={() => handleGenderSelect('Outro')}
              >
                <Typography variant="bodyMedium">Outro</Typography>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        {errors.gender && (
          <Typography variant="bodySmall" style={[styles.errorText, { color: 'red' }]}>
            {errors.gender.message}
          </Typography>
        )}
      </View>

      {/* Campo de Data de Nascimento */}
      <View style={styles.fieldContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            label="Data de Nascimento"
            value={birthDateValue}
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            error={!!errors.birthDate}
            style={styles.input}
            mode="outlined"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
        {errors.birthDate && (
          <Typography variant="bodySmall" style={[styles.errorText, { color: 'red' }]}>
            {errors.birthDate.message}
          </Typography>
        )}
      </View>

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
  fieldContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default RegistrationForm;