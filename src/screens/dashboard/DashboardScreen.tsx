import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import DrawerMenu from '../../components/layout/DrawerMenu';
import FireIcon from '../../components/gamification/FireIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { palette, semanticColors } from '../../theme/colors';

// Definição dos tipos das rotas do dashboard
type DashboardStackParamList = {
  Dashboard: undefined;
  UsageCharts: undefined;
  UsageGoal: undefined;
  ReflectiveDiary: undefined;
};

// Função utilitária para formatar minutos em "xh ymin"
function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

const DashboardScreen = () => {
  const [reflection, setReflection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [isFireActive, setIsFireActive] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();

  // Simulação do tempo de uso (em minutos)
  const screenTime: number = 200; // Exemplo: 3h 20min
  const MAX_SCREEN_TIME: number = 180; // 3 horas em minutos
  const metaTexto =
    screenTime < MAX_SCREEN_TIME
      ? `Meta diária: ${formatMinutes(MAX_SCREEN_TIME)} — continue focado!`
      : screenTime === MAX_SCREEN_TIME
      ? `Parabéns! Você atingiu sua meta diária 🎉`
      : `Você ultrapassou sua meta diária. Que tal uma pausa?`;

  useEffect(() => {
    // Aqui você implementaria a lógica real de verificação do tempo de uso
    if (screenTime <= MAX_SCREEN_TIME) {
      setIsFireActive(true);
      setConsecutiveDays(prev => prev + 1);
    } else {
      setIsFireActive(false);
      setConsecutiveDays(0);
    }
  }, [screenTime]);

  return (
    <ScreenWrapper style={{ backgroundColor: palette.backgroundMain }}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="menu" 
          size={30} 
          iconColor={palette.purpleDark} 
          style={[styles.menuButton, { backgroundColor: palette.purpleLight }]} 
          onPress={() => setIsMenuOpen(true)}
        />
      </View>

      <DrawerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigation={navigation}
      />

      {/* Saudação */}
      <Typography variant="headlineMedium" style={[styles.greeting, { color: semanticColors.primary, fontWeight: 'bold', fontSize: 32 }]}>Bem-vindo, João</Typography>
      
      {/* Gamificação - Foguinho */}
      <View style={styles.fireIcon}>
        <FireIcon isActive={isFireActive} consecutiveDays={consecutiveDays} />
        <Typography style={styles.consecutiveDays}>{consecutiveDays} dias consecutivos</Typography>
        <Typography style={styles.motivationalText}>
          {consecutiveDays === 0 ? 'Comece hoje sua sequência!' : 'Continue firme, cada dia conta!'}
        </Typography>
      </View>

      {/* Bloco de tempo de uso */}
      <View style={styles.usageBlock}>
        <IconButton icon="clock-outline" size={58} iconColor={palette.usageIconBlue} style={{ marginRight: 16, backgroundColor: 'transparent' }} />
        <View style={{ flex: 1 }}>
          <Typography variant="labelMedium" style={styles.usageTitle}>
            Tempo de uso hoje
          </Typography>
          <Typography variant="headlineLarge" style={styles.usageTime}>
            {formatMinutes(screenTime)}
          </Typography>
          <Typography variant="bodySmall" style={styles.usageMeta}>
            {metaTexto}
          </Typography>
        </View>
      </View>
      {/* Botões de funcionalidades */}
      <View style={styles.featuresRow}>
        <TouchableOpacity style={styles.featureCardOrange} onPress={() => navigation.navigate('UsageGoal')}>
          <IconButton icon="target" size={36} iconColor={palette.orangeDark} style={styles.featureIcon} />
          <Typography variant="titleMedium" style={styles.featureTitleOrange}>Metas de Uso</Typography>
          <Typography variant="bodySmall" style={styles.featureDesc}>Defina e acompanhe suas metas diárias.</Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.featuresRow}>
        <TouchableOpacity style={styles.featureCardPurple} onPress={() => navigation.navigate('UsageCharts')}>
          <IconButton icon="chart-bar" size={36} iconColor={palette.purpleDark} style={styles.featureIcon} />
          <Typography variant="titleMedium" style={styles.featureTitlePurple}>Gráficos de Uso</Typography>
          <Typography variant="bodySmall" style={styles.featureDesc}>Visualize seu progresso ao longo do tempo.</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureCardGreen} onPress={() => navigation.navigate('ReflectiveDiary')}>
          <IconButton icon="book-open-variant" size={36} iconColor={palette.greenDark} style={styles.featureIcon} />
          <Typography variant="titleMedium" style={styles.featureTitleGreen}>Diário Reflexivo</Typography>
          <Typography variant="bodySmall" style={styles.featureDesc}>Registre seus sentimentos e aprendizados.</Typography>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 8,
  },
  menuButton: {
    borderRadius: 20,
    margin: 0,
    padding: 0,
    height: 48,
    width: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.purpleLight,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    color: semanticColors.primary,
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 8,
    marginLeft: 8,
  },
  usageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 8,
    backgroundColor: palette.usageCardGradientStart,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  usageTitle: {
    color: semanticColors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  usageTime: {
    color: semanticColors.primary,
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 2,
  },
  usageMeta: {
    color: semanticColors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 8,
    gap: 12,
  },
  featureCardOrange: {
    flex: 1,
    backgroundColor: palette.orangeLight,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginHorizontal: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  featureCardPurple: {
    flex: 1,
    backgroundColor: palette.purpleLight,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginHorizontal: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  featureCardGreen: {
    flex: 1,
    backgroundColor: palette.greenLight,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginHorizontal: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureTitleOrange: {
    color: palette.orangeDark,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  featureTitlePurple: {
    color: palette.purpleDark,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  featureTitleGreen: {
    color: palette.greenDark,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  featureDesc: {
    color: semanticColors.textSecondary,
    textAlign: 'center',
  },
  motivationalText: {
    color: semanticColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  fireIcon: {
    marginBottom: 8,
  },
  consecutiveDays: {
    color: semanticColors.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 8,
  },
});

export default DashboardScreen; 