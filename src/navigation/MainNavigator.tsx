import React from 'react';
// import { useSelector } from 'react-redux'; // Exemplo se usar Redux para estado de auth
// import { useAuth } from '../contexts/AuthContext'; // Exemplo se usar Context API
import AuthNavigator from './AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { useAuth } from '../../App';
import UsageChartsScreen from '../screens/dashboard/UsageChartsScreen';
import UsageGoalScreen from '../screens/dashboard/UsageGoalScreen';
import ReflectiveDiaryScreen from '../screens/dashboard/ReflectiveDiaryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import ReflectionHistoryScreen from '../screens/dashboard/ReflectionHistoryScreen';
import HelpScreen from '../screens/dashboard/HelpScreen';
import { RootStackParamList } from '../types/navigation';
// import AppTabsNavigator from './AppTabsNavigator'; // Supondo que você tenha um navegador para o app principal

const AppStack = createNativeStackNavigator<RootStackParamList>();

// Simulação de estado de autenticação para este exemplo
// Em um app real, você obteria isso do seu estado global (Redux, Context, AsyncStorage)
const MainNavigator = () => {
  const { isAuthenticated } = useAuth();

  // No futuro, você verificaria o token:
  // const [isLoading, setIsLoading] = useState(true);
  // const [userToken, setUserToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('userToken');
  //       setUserToken(token);
  //     } catch (e) {
  //       // restaurar token falhou
  //     }
  //     setIsLoading(false);
  //   };
  //   bootstrapAsync();
  // }, []);

  // if (isLoading) {
  //   return <SplashScreen />; // Ou um ActivityIndicator
  // }

  // return userToken ? <AppTabsNavigator /> : <AuthNavigator />;

  if (isAuthenticated) {
    return (
      <AppStack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: true }}>
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
      </AppStack.Navigator>
    );
  }
  return <AuthNavigator />;
};

export default MainNavigator;