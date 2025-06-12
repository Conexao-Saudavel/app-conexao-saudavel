import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingCarousel } from '../components/Onboarding/OnboardingCarousel';
import { InitialPreferences, UserPreferences } from '../components/Onboarding/InitialPreferences';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import DatabaseService from '../services/DatabaseService';
import ScreenTimeService from '../services/ScreenTimeService';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleOnboardingComplete = () => {
    setShowPreferences(true);
  };

  const handlePreferencesComplete = async (preferences: UserPreferences) => {
    try {
      console.log('Salvando preferências do usuário...');
      
      // Salvar preferências no banco de dados
      const databaseService = DatabaseService.getInstance();
      await databaseService.setSetting('daily_goal_hours', (preferences.screenTimeGoal / 60).toString());
      await databaseService.setSetting('notifications_enabled', preferences.notificationsEnabled.toString());
      await databaseService.setSetting('first_run', 'false'); // Marcar que não é mais primeira execução
      
      // NÃO marcar permissão como concedida automaticamente
      // await databaseService.setSetting('has_wellbeing_access', 'false'); // Manter como false até verificação real

      // Inicializar o ScreenTimeService SEM marcar permissão como concedida
      const screenTimeService = ScreenTimeService.getInstance();
      // await screenTimeService.setWellbeingAccess(true); // REMOVIDO - não marcar automaticamente
      await screenTimeService.startMonitoring();

      console.log('Preferências salvas, navegando para Dashboard...');
      
      // Navegar para o Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      // Mesmo com erro, navegar para o Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    }
  };

  const handlePreferencesSkip = async () => {
    try {
      console.log('Salvando configurações padrão...');
      
      // Salvar configurações padrão
      const databaseService = DatabaseService.getInstance();
      await databaseService.setSetting('daily_goal_hours', '4'); // 4 horas padrão
      await databaseService.setSetting('notifications_enabled', 'true');
      await databaseService.setSetting('first_run', 'false');
      
      // NÃO marcar permissão como concedida automaticamente
      // await databaseService.setSetting('has_wellbeing_access', 'false'); // Manter como false

      // Inicializar o ScreenTimeService SEM marcar permissão como concedida
      const screenTimeService = ScreenTimeService.getInstance();
      // await screenTimeService.setWellbeingAccess(true); // REMOVIDO - não marcar automaticamente
      await screenTimeService.startMonitoring();

      console.log('Configurações padrão salvas, navegando para Dashboard...');
      
      // Navegar para o Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error('Erro ao salvar configurações padrão:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    }
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