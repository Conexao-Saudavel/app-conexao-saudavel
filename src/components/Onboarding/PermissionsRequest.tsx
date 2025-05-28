import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import Typography from '../common/Typography';
import Button from '../common/Button';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

interface PermissionsRequestProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const PermissionsRequest: React.FC<PermissionsRequestProps> = ({
  onComplete,
  onSkip,
}) => {
  const theme = useTheme();

  const handleOpenSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        await IntentLauncher.startActivityAsync(
          'android.settings.USAGE_ACCESS_SETTINGS'
        );
      }
    } catch (error) {
      console.error('Erro ao abrir configurações:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="headlineMedium" style={styles.title}>
          Permissão de Uso
        </Typography>

        <Typography variant="bodyLarge" style={styles.description}>
          Para ajudar você a gerenciar seu tempo de tela, precisamos de acesso aos dados de uso do seu dispositivo.
        </Typography>

        <View style={styles.stepsContainer}>
          <Typography variant="titleLarge" style={styles.stepsTitle}>
            Como configurar:
          </Typography>

          <View style={styles.step}>
            <Typography variant="bodyLarge" style={styles.stepNumber}>1</Typography>
            <Typography variant="bodyLarge" style={styles.stepText}>
              Toque no botão "Abrir Configurações" abaixo
            </Typography>
          </View>

          <View style={styles.step}>
            <Typography variant="bodyLarge" style={styles.stepNumber}>2</Typography>
            <Typography variant="bodyLarge" style={styles.stepText}>
              Procure por "Conexão Saudável" na lista de apps
            </Typography>
          </View>

          <View style={styles.step}>
            <Typography variant="bodyLarge" style={styles.stepNumber}>3</Typography>
            <Typography variant="bodyLarge" style={styles.stepText}>
              Ative a permissão de "Acesso ao uso"
            </Typography>
          </View>

          <View style={styles.step}>
            <Typography variant="bodyLarge" style={styles.stepNumber}>4</Typography>
            <Typography variant="bodyLarge" style={styles.stepText}>
              Volte para o app e toque em "Continuar"
            </Typography>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Pular"
            onPress={onSkip}
            mode="text"
            style={styles.skipButton}
          />
          <Button
            title="Abrir Configurações"
            onPress={handleOpenSettings}
            style={styles.settingsButton}
          />
          <Button
            title="Continuar"
            onPress={onComplete}
            style={styles.continueButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  stepsTitle: {
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
  },
  buttons: {
    width: '100%',
    gap: 10,
  },
  skipButton: {
    marginBottom: 10,
  },
  settingsButton: {
    marginBottom: 10,
  },
  continueButton: {
    marginTop: 10,
  },
});

export default PermissionsRequest; 