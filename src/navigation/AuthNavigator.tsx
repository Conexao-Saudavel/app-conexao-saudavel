import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { RootStackParamList } from '../types/navigation';
// Importe outras telas de autenticação se houver, ex: ForgotPasswordScreen

// Definindo os tipos para as rotas do AuthNavigator
export type AuthStackParamList = {
  Login: undefined; // undefined significa que a rota não espera parâmetros
  Register: undefined;
  ForgotPassword?: { email?: string }; // Exemplo de rota com parâmetro opcional
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  return (
    // Para iniciar na tela de Login, defina 'Login' como initialRouteName
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha', headerShown: true }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;