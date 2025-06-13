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
import GamificationService from '../../services/GamificationService';
import NotificationService from '../../services/NotificationService';
import ScreenTimeService from '../../services/ScreenTimeService';
import DatabaseService from '../../services/DatabaseService';
import { FormatDailyUsage, SecondsToMinutes } from '../../utils/FormatTime';
import { useAuth } from '../../contexts/AuthContext';

// Definição dos tipos das rotas do dashboard
type DashboardStackParamList = {
  Dashboard: undefined;
  UsageCharts: undefined;
  UsageGoal: undefined;
  ReflectiveDiary: undefined;
};

// Função utilitária para formatar minutos em "xh ymin"
function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
}

const DashboardScreen = () => {
  const [reflection, setReflection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [isFireActive, setIsFireActive] = useState(false);
  const [fireColor, setFireColor] = useState('#ccc');
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [screenTime, setScreenTime] = useState(0);
  const [userGoal, setUserGoal] = useState(240); // 4 horas padrão
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  const { userData } = useAuth();

  useEffect(() => {
    initializeServices();
    loadDashboardData();
  }, []);

  const initializeServices = async () => {
    try {
      // Inicializar serviços
      const notificationService = NotificationService.getInstance();
      await notificationService.initialize();
      
      const screenTimeService = ScreenTimeService.getInstance();
      await screenTimeService.startMonitoring();
    } catch (error) {
      console.error('Erro ao inicializar serviços:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados de gamificação
      const gamificationService = GamificationService.getInstance();
      const gamificationStats = await gamificationService.getGamificationStats();
      
      setConsecutiveDays(gamificationStats.streakData.currentStreak);
      setIsFireActive(gamificationStats.isFireActive);
      setFireColor(gamificationStats.fireColor);
      setMotivationalMessage(gamificationStats.motivationalMessage);

      // Carregar dados de uso atual
      const today = new Date().toISOString().split('T')[0];
      const screenTimeService = ScreenTimeService.getInstance();
      const dailySummary = await screenTimeService.getDailySummary(today);
      
      if (dailySummary) {
        setScreenTime(dailySummary.totalUsage);
      }

      // Carregar meta do usuário
      const databaseService = DatabaseService.getInstance();
      const goalHours = await databaseService.getSetting('daily_goal_hours');
      if (goalHours) {
        setUserGoal(parseFloat(goalHours) * 3600); // Converter para segundos
      }

      // Verificar e enviar notificações
      const notificationService = NotificationService.getInstance();
      await notificationService.checkAndSendUsageNotifications();

      // Enviar notificação de streak se aplicável
      if (gamificationStats.streakData.currentStreak > 0) {
        await notificationService.sendStreakNotification(gamificationStats.streakData.currentStreak);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar mensagem dinâmica baseada no progresso
  const getMetaMessage = () => {
    if (userGoal <= 0) return 'Defina sua meta diária para começar!';
    
    const goalSeconds = userGoal;
    const progress = (screenTime / goalSeconds) * 100;
    
    if (progress === 0) {
      return `Meta diária: ${formatMinutes(userGoal / 3600)} — comece sua jornada!`;
    } else if (progress < 50) {
      return `Meta diária: ${formatMinutes(userGoal / 3600)} — você está no caminho certo!`;
    } else if (progress < 80) {
      return `Meta diária: ${formatMinutes(userGoal / 3600)} — continue focado!`;
    } else if (progress < 100) {
      return `Meta diária: ${formatMinutes(userGoal / 3600)} — atenção, você está próximo do limite!`;
    } else if (progress === 100) {
      return `Parabéns! Você atingiu sua meta diária 🎉`;
    } else {
      return `Você ultrapassou sua meta diária. Que tal uma pausa?`;
    }
  };

  // Obter nome do usuário para saudação
  const getUserName = () => {
    if (userData?.full_name) {
      const firstName = userData.full_name.split(' ')[0];
      return firstName;
    }
    return 'Usuário';
  };

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: palette.backgroundMain }}>
        <View style={styles.loadingContainer}>
          <Typography variant="bodyLarge" style={{ color: semanticColors.textPrimary }}>
            Carregando...
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

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
      <Typography variant="headlineMedium" style={[styles.greeting, { color: semanticColors.primary, fontWeight: 'bold', fontSize: 32 }]}>
        Bem-vindo, {getUserName()}
      </Typography>
      
      {/* Gamificação - Foguinho */}
      <View style={styles.fireIcon}>
        <FireIcon 
          isActive={isFireActive} 
          consecutiveDays={consecutiveDays}
          fireColor={fireColor}
          motivationalMessage={motivationalMessage}
        />
      </View>

      {/* Bloco de tempo de uso */}
      <View style={styles.usageBlock}>
        <IconButton icon="clock-outline" size={58} iconColor={palette.usageIconBlue} style={{ marginRight: 16, backgroundColor: 'transparent' }} />
        <View style={{ flex: 1 }}>
          <Typography variant="labelMedium" style={styles.usageTitle}>
            Tempo de uso hoje
          </Typography>
          <Typography variant="headlineLarge" style={styles.usageTime}>
            {FormatDailyUsage(screenTime)}
          </Typography>
          <Typography variant="bodySmall" style={styles.usageMeta}>
            {getMetaMessage()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen; 