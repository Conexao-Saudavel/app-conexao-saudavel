import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingCarousel } from '../components/Onboarding/OnboardingCarousel';
import { InitialPreferences, UserPreferences } from '../components/Onboarding/InitialPreferences';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [showPreferences, setShowPreferences] = React.useState(false);

  const handleOnboardingComplete = () => {
    setShowPreferences(true);
  };

  const handlePreferencesComplete = async (preferences: UserPreferences) => {
    try {
      // TODO: Implementar persistência no banco de dados
      console.log('Preferências salvas:', preferences);

      // Navegar para a tela principal
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const handleSkip = () => {
    // TODO: Implementar persistência no banco de dados
    console.log('Onboarding pulado');

    // Navegar para a tela principal
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  if (showPreferences) {
    return (
      <View style={styles.container}>
        <InitialPreferences
          onComplete={handlePreferencesComplete}
          onSkip={handleSkip}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OnboardingCarousel
        onComplete={handleOnboardingComplete}
        onSkip={handleSkip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 