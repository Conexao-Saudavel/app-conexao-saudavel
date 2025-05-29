// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importe se for usar navegação
// import { StackNavigationProp } from '@react-navigation/stack'; // Tipo para navegação stack
import ScreenWrapper from '../../components/common/ScreenWrapper';
import RegistrationForm from '../../components/auth/RegistrationForm';
import Typography from '../../components/common/Typography';
import { RegisterFormData } from '../../types/auth';
// import { AuthStackParamList } from '../../navigation/AuthNavigator'; // Se tiver um navigator tipado
import * as authService from '../../services/api/authService'; // Simulação
import { semanticColors } from '../../theme/colors';

// type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  // const navigation = useNavigation<RegisterScreenNavigationProp>();
  const navigation = useNavigation(); // Uso genérico
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simula chamada de API
      await authService.register(data);
      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.', [
        { text: 'OK', onPress: () => navigation.navigate('Login' as never) }, // Navega para Login após sucesso
      ]);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      Alert.alert('Erro no Cadastro', error.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => Alert.alert('Erro', 'Não foi possível abrir o link.'));
  };

  const handleTermsPress = () => {
    navigation.navigate('TermsOfUse' as never);
  };

  const handlePolicyPress = () => {
    navigation.navigate('PrivacyPolicy' as never);
  };


  return (
    <ScreenWrapper scrollable style={{ backgroundColor: semanticColors.background }}>
      <View style={styles.header}>
        
        <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.textPrimary }]}>Criar Conta</Typography>
        <Typography variant="bodyMedium" style={[styles.subtitle, { color: semanticColors.textSecondary }]}>
          Preencha os campos abaixo para criar sua conta.
        </Typography>
      </View>
      <RegistrationForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        onTermsPress={handleTermsPress}
        onPolicyPress={handlePolicyPress}
      />
      <View style={styles.loginLinkContainer}>
        <Typography variant="bodyMedium" style={{ color: semanticColors.textSecondary }}>Já tem uma conta? </Typography>
        <Typography
            variant="bodyMedium"
            style={[styles.loginLink, { color: semanticColors.success }]}
            onPress={() => navigation.navigate('Login' as never)} // Navega para Login
        >
            Faça Login
        </Typography>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    color: '#2D2D2D',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#A3FF7A',
  },
  container: {
    backgroundColor: '#F3F5F9',
    flex: 1,
  },
});

export default RegisterScreen;