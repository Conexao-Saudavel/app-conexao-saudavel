import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingCarousel } from '../components/Onboarding/OnboardingCarousel';
import { InitialPreferences, UserPreferences } from '../components/Onboarding/InitialPreferences';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleOnboardingComplete = () => {
    setShowPreferences(true);
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    // Salvar preferências e navegar para o Dashboard
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  const handlePreferencesSkip = () => {
    // Navegar para o Dashboard mesmo se pular as preferências
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  if (showPreferences) {
    return (
      <InitialPreferences
        onComplete={handlePreferencesComplete}
        onSkip={handlePreferencesSkip}
      />
    );
  }

  return (
    <View style={styles.container}>
      <OnboardingCarousel 
        onComplete={handleOnboardingComplete}
        onSkip={handlePreferencesSkip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 