import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Button from '../common/Button';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-paper';

interface InitialPreferencesProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

export interface UserPreferences {
  screenTimeGoal: number;
  notificationsEnabled: boolean;
}

export const InitialPreferences: React.FC<InitialPreferencesProps> = ({
  onComplete,
  onSkip,
}) => {
  const theme = useTheme();
  const [screenTimeGoal, setScreenTimeGoal] = React.useState(120); // 2 horas padrão
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleComplete = () => {
    onComplete({
      screenTimeGoal,
      notificationsEnabled,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Configure suas Preferências
      </Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.onBackground }]}>
          Meta diária de tempo de tela
        </Text>
        <Text style={[styles.value, { color: theme.colors.primary }]}>
          {screenTimeGoal} minutos
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={480}
          step={30}
          value={screenTimeGoal}
          onValueChange={setScreenTimeGoal}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.outline}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.onBackground }]}>
          Notificações motivacionais
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title="Pular"
          onPress={onSkip}
          mode="text"
          style={styles.skipButton}
        />
        <Button
          title="Salvar"
          onPress={handleComplete}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  skipButton: {
    minWidth: 100,
  },
  saveButton: {
    minWidth: 120,
  },
}); 