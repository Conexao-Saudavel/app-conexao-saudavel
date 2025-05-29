import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Switch } from 'react-native-paper';
import Typography from '../common/Typography';
import Button from '../common/Button';
import Slider from '@react-native-community/slider';
import PermissionsRequest from './PermissionsRequest';
import ScreenTimeService from '../../services/ScreenTimeService';
import { semanticColors } from '../../theme/colors';

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

  function formatMinutes(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  }

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
        Vamos começar sua jornada!
      </Typography>
      <Typography variant="bodyMedium" style={styles.subtitle}>
        Essas configurações vão te ajudar a dar o primeiro passo para mudar seu hábito.
      </Typography>

      <View style={styles.section}>
        <Typography variant="bodyLarge" style={styles.label}>
          Meta diária de tempo de tela
        </Typography>
        <Typography variant="titleLarge" style={styles.value}>
          {formatMinutes(screenTimeGoal)}
        </Typography>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={480}
          step={10}
          value={screenTimeGoal}
          onValueChange={setScreenTimeGoal}
          minimumTrackTintColor={semanticColors.primary}
          maximumTrackTintColor={semanticColors.outline}
          thumbTintColor={semanticColors.primary}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="bodyLarge" style={styles.label}>
          Receba lembretes motivacionais para manter o foco no que importa.
        </Typography>
        <View style={styles.switchRow}>
          <Typography variant="bodyMedium" style={styles.switchLabel}>
            Notificações motivacionais
          </Typography>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            color={semanticColors.primary}
          />
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Pular"
          onPress={onSkip}
          mode="text"
          style={styles.skipButton}
          labelStyle={{ color: semanticColors.primary }}
        />
        <Button
          title="Salvar"
          onPress={handleComplete}
          style={styles.saveButton}
          labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: semanticColors.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    color: semanticColors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    marginBottom: 10,
    color: semanticColors.textPrimary,
    textAlign: 'center',
  },
  value: {
    marginBottom: 10,
    color: semanticColors.primary,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  switchLabel: {
    color: semanticColors.textPrimary,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  saveButton: {
    flex: 2,
    backgroundColor: semanticColors.primary,
    borderRadius: 24,
  },
});

export default InitialPreferences; 