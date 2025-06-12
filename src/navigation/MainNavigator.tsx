import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux'; // Exemplo se usar Redux para estado de auth
// import { useAuth } from '../contexts/AuthContext'; // Exemplo se usar Context API
import AuthNavigator from './AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { useAuth } from '../contexts/AuthContext';
import UsageChartsScreen from '../screens/dashboard/UsageChartsScreen';
import UsageGoalScreen from '../screens/dashboard/UsageGoalScreen';
import ReflectiveDiaryScreen from '../screens/dashboard/ReflectiveDiaryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import ReflectionHistoryScreen from '../screens/dashboard/ReflectionHistoryScreen';
import HelpScreen from '../screens/dashboard/HelpScreen';
import SettingsScreen from '../screens/dashboard/SettingsScreen';
import { RootStackParamList } from '../types/navigation';
import DatabaseService from '../services/DatabaseService';
import CredentialStorage from '../services/storage/credentialStorage';
import { getAccessToken } from '../services/storage/tokenStorage';
// import AppTabsNavigator from './AppTabsNavigator'; // Supondo que você tenha um navegador para o app principal

const AppStack = createNativeStackNavigator<RootStackParamList>();

// Simulação de estado de autenticação para este exemplo
// Em um app real, você obteria isso do seu estado global (Redux, Context, AsyncStorage)
const MainNavigator = () => {
  const { isAuthenticated, login } = useAuth();
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFirstRun = async () => {
      try {
        console.log('=== VERIFICANDO AUTENTICAÇÃO E PRIMEIRA EXECUÇÃO ===');
        
        // Verificar se há token de acesso válido
        const accessToken = await getAccessToken();
        if (accessToken) {
          console.log('✓ Token encontrado, usuário autenticado');
          login();
        } else {
          console.log('✗ Nenhum token encontrado');
          // Se não há token, verificar se há credenciais salvas para login automático
          const savedCredentials = await CredentialStorage.loadCredentials();
          if (savedCredentials && savedCredentials.remember) {
            console.log('✓ Credenciais salvas encontradas, tentando login automático...');
            // Aqui você poderia implementar login automático se desejar
            // Por enquanto, vamos apenas logar que encontrou credenciais
          }
        }

        // Verificar primeira execução com logs detalhados
        console.log('Verificando configuração first_run...');
        const databaseService = DatabaseService.getInstance();
        
        // Listar todas as configurações para debug
        const allSettings = await databaseService.getAllSettings();
        console.log('Configurações atuais na tabela:');
        allSettings.forEach(setting => {
          console.log(`  - ${setting.key}: '${setting.value}'`);
        });
        
        const firstRun = await databaseService.getSetting('first_run');
        console.log(`Valor de first_run obtido: '${firstRun}' (tipo: ${typeof firstRun})`);
        
        // Lógica mais robusta para determinar se deve mostrar onboarding
        let shouldShowOnboarding = false;
        
        if (firstRun === null) {
          console.log('first_run é null - deve mostrar onboarding');
          shouldShowOnboarding = true;
        } else if (firstRun === 'true') {
          console.log('first_run é "true" - deve mostrar onboarding');
          shouldShowOnboarding = true;
        } else if (firstRun === 'false') {
          console.log('first_run é "false" - NÃO deve mostrar onboarding');
          shouldShowOnboarding = false;
        } else {
          console.log(`first_run tem valor inesperado: '${firstRun}' - deve mostrar onboarding`);
          shouldShowOnboarding = true;
        }
        
        setIsFirstRun(shouldShowOnboarding);
        console.log(`Decisão final: ${shouldShowOnboarding ? 'MOSTRAR' : 'NÃO MOSTRAR'} onboarding`);
        console.log('=== VERIFICAÇÃO CONCLUÍDA ===');
        
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação e primeira execução:', error);
        setIsFirstRun(true); // Em caso de erro, assume que é primeira execução
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFirstRun();
  }, [login]);

  if (isLoading) {
    return null; // Ou um loading spinner
  }

  if (isAuthenticated) {
    return (
      <AppStack.Navigator 
        initialRouteName={isFirstRun ? "Onboarding" : "Dashboard"} 
        screenOptions={{ headerShown: true }}
      >
        <AppStack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <AppStack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <AppStack.Screen name="UsageCharts" component={UsageChartsScreen} options={{ title: 'Gráficos de Uso' }} />
        <AppStack.Screen name="UsageGoal" component={UsageGoalScreen} options={{ title: 'Metas de Uso' }} />
        <AppStack.Screen name="ReflectiveDiary" component={ReflectiveDiaryScreen} options={{ title: 'Diário Reflexivo' }} />
        <AppStack.Screen name="ReflectionHistory" component={ReflectionHistoryScreen} options={{ title: 'Histórico de Reflexões' }} />
        <AppStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        <AppStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
        <AppStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Alterar Senha' }} />
        <AppStack.Screen name="Help" component={HelpScreen} options={{ title: 'Ajuda' }} />
        <AppStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
      </AppStack.Navigator>
    );
  }
  return <AuthNavigator />;
};

export default MainNavigator;