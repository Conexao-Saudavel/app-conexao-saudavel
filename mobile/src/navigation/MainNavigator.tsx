import React from 'react';
// import { useSelector } from 'react-redux'; // Exemplo se usar Redux para estado de auth
// import { useAuth } from '../contexts/AuthContext'; // Exemplo se usar Context API
import AuthNavigator from './AuthNavigator';
// import AppTabsNavigator from './AppTabsNavigator'; // Supondo que você tenha um navegador para o app principal

// Simulação de estado de autenticação para este exemplo
// Em um app real, você obteria isso do seu estado global (Redux, Context, AsyncStorage)
const MainNavigator = () => {
  const isAuthenticated = false; // Mude para true para ver o AppTabsNavigator (simulação)

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

  // Por agora, para mostrar RegisterScreen primeiro:
  return <AuthNavigator />;
};

export default MainNavigator;