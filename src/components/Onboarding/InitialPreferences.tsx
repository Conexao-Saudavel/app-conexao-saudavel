import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Switch } from 'react-native-paper';
import Typography from '../common/Typography';
import Button from '../common/Button';
import Slider from '@react-native-community/slider';
import PermissionsRequest from './PermissionsRequest';
import ScreenTimeService from '../../services/ScreenTimeService';

export interface UserPreferences {
  screenTimeGoal: number;
  notificationsEnabled: boolean;
}

interface InitialPreferencesProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

export const InitialPreferences: React.FC<InitialPreferencesProps> = ({
  onComplete,
  onSkip,
}) => {
  const theme = useTheme();
  const [screenTimeGoal, setScreenTimeGoal] = useState(120); // 2 horas padrão
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleComplete = async () => {
    const screenTimeService = ScreenTimeService.getInstance();
    const hasAccess = await screenTimeService.checkWellbeingAccess();

    if (!hasAccess) {
      setShowPermissions(true);
      return;
    }

    onComplete({
      screenTimeGoal,
      notificationsEnabled,
    });
  };

  const handlePermissionsComplete = async () => {
    const screenTimeService = ScreenTimeService.getInstance();
    await screenTimeService.setWellbeingAccess(true);
    await screenTimeService.startMonitoring();

    onComplete({
      screenTimeGoal,
      notificationsEnabled,
    });
  };

  const handlePermissionsSkip = async () => {
    onComplete({
      screenTimeGoal,
      notificationsEnabled,
    });
  };

  if (showPermissions) {
    return (
      <PermissionsRequest
        onComplete={handlePermissionsComplete}
        onSkip={handlePermissionsSkip}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>
        Configure suas Preferências
      </Typography>

      <View style={styles.section}>
        <Typography variant="bodyLarge" style={styles.label}>
          Meta diária de tempo de tela
        </Typography>
        <Typography variant="titleLarge" style={styles.value}>
          {screenTimeGoal} minutos
        </Typography>
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
        <Typography variant="bodyLarge" style={styles.label}>
          Notificações motivacionais
        </Typography>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  label: {
    marginBottom: 10,
  },
  value: {
    marginBottom: 10,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttons: {
    marginTop: 20,
    gap: 10,
  },
  skipButton: {
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default InitialPreferences; 