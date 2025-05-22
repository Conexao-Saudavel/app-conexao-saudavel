import React from 'react';
// import { useSelector } from 'react-redux'; // Exemplo se usar Redux para estado de auth
// import { useAuth } from '../contexts/AuthContext'; // Exemplo se usar Context API
import AuthNavigator from './AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { useAuth } from '../App';
import UsageChartsScreen from '../screens/dashboard/UsageChartsScreen';
import UsageGoalScreen from '../screens/dashboard/UsageGoalScreen';
import ReflectiveDiaryScreen from '../screens/dashboard/ReflectiveDiaryScreen';
// import AppTabsNavigator from './AppTabsNavigator'; // Supondo que você tenha um navegador para o app principal

const AppStack = createNativeStackNavigator();

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
      <AppStack.Navigator screenOptions={{ headerShown: true }}>
        <AppStack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <AppStack.Screen name="UsageCharts" component={UsageChartsScreen} options={{ title: 'Gráficos de Uso' }} />
        <AppStack.Screen name="UsageGoal" component={UsageGoalScreen} options={{ title: 'Metas de Uso' }} />
        <AppStack.Screen name="ReflectiveDiary" component={ReflectiveDiaryScreen} options={{ title: 'Diário Reflexivo' }} />
      </AppStack.Navigator>
    );
  }
  return <AuthNavigator />;
};

export default MainNavigator;