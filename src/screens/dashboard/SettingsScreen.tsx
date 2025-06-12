import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { semanticColors } from '../../theme/colors';

const APP_VERSION = '1.0.0'; // Atualize conforme necessário

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <ScreenWrapper scrollable>
      <Typography variant="headlineMedium" style={styles.title}>Configurações</Typography>

      {/* Notificações */}
      <Typography variant="titleMedium" style={styles.sectionTitle}>Notificações</Typography>
      <View style={styles.sectionBox}>
        <View style={styles.itemRow}>
          <Typography variant="bodyLarge">Ativar lembretes de uso excessivo</Typography>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? semanticColors.primary : '#ccc'}
            trackColor={{ true: semanticColors.primary, false: '#ccc' }}
          />
        </View>
      </View>

      {/* Sobre o App */}
      <Typography variant="titleMedium" style={styles.sectionTitle}>Sobre o App</Typography>
      <View style={styles.sectionBox}>
        <View style={styles.itemRow}>
          <Typography variant="bodyLarge">Versão do aplicativo</Typography>
          <Typography variant="bodyLarge" style={{ color: semanticColors.textSecondary }}>{APP_VERSION}</Typography>
        </View>
        <View style={styles.item}>
          <Typography variant="bodyLarge" style={{ fontWeight: 'bold', marginBottom: 4 }}>Equipe de desenvolvimento</Typography>
          <Typography variant="bodyMedium">Diego Humberto, Francisco Macedo, José Roberto e José Caio.</Typography>
          <Typography variant="bodyMedium" style={{ marginTop: 8 }}>
            Agradecimento especial ao professor André Caetano pelas orientações e à Faculdade Uninassau.
          </Typography>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    color: semanticColors.primary,
  },
  sectionBox: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
  },
  item: {
    paddingVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});

export default SettingsScreen; 