import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
// Importe outras telas de autenticação se houver, ex: ForgotPasswordScreen

// Definindo os tipos para as rotas do AuthNavigator
export type AuthStackParamList = {
  Login: undefined; // undefined significa que a rota não espera parâmetros
  Register: undefined;
  ForgotPassword?: { email?: string }; // Exemplo de rota com parâmetro opcional
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    // Para iniciar na tela de Cadastro, defina 'Register' como initialRouteName
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;