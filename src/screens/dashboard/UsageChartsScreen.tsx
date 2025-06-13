import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { palette, semanticColors } from '../../theme/colors';
import ScreenTimeService, { AppUsage, DailySummary } from '../../services/ScreenTimeService';
import UsageLineChart from '../../components/charts/UsageLineChart';
import Button from '../../components/common/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DatabaseService from '../../services/DatabaseService';
import GamificationService from '../../services/GamificationService';
import { FormatDailyUsage } from '../../utils/FormatTime';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

const UsageChartsScreen = () => {
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userGoal, setUserGoal] = useState<number>(240); // 4 horas padrão

  useEffect(() => {
    loadData();
    loadUserGoal();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const screenTimeService = ScreenTimeService.getInstance();
      const today = new Date().toISOString().split('T')[0];

      // Carregar dados reais do Digital Wellbeing
      await screenTimeService.startMonitoring();

      // Obter resumo diário
      const summary = await screenTimeService.getDailySummary(today);
      setDailySummary(summary);

      // Obter dados específicos do período selecionado
      const chartDataResult = await screenTimeService.getChartDataByPeriod(selectedPeriod, today);
      setChartData({
        labels: chartDataResult.labels,
        datasets: [{ data: chartDataResult.data }]
      });

      // Obter top apps do período selecionado
      const topApps = await screenTimeService.getTopAppsByPeriod(selectedPeriod, today);
      setAppUsage(topApps.map((app: {name: string, duration: number}) => ({
        id: app.name,
        packageName: app.name,
        appName: app.name,
        startTime: Date.now(),
        endTime: Date.now(),
        duration: app.duration,
        category: 'other',
        foreground: true,
        synced: false,
        syncAttemptCount: 0,
        createdAt: Date.now()
      })));
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados de uso. Tente novamente.');
      
      // Fallback: usar dados vazios para evitar crash
      setChartData({
        labels: [],
        datasets: [{ data: [] }]
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserGoal = async () => {
    try {
      const databaseService = DatabaseService.getInstance();
      const goalHours = await databaseService.getSetting('daily_goal_hours');
      if (goalHours) {
        setUserGoal(parseFloat(goalHours) * 3600); // Converter para segundos
      }
    } catch (error) {
      console.error('Erro ao carregar meta do usuário:', error);
    }
  };

  const getChartData = () => {
    // Retornar os dados já processados pelo ScreenTimeService
    return chartData;
  };

  const getTopApps = () => {
    try {
      // Usar os dados já filtrados por período que estão em appUsage
      if (!appUsage || appUsage.length === 0) return [];

      // Calcular total de uso para percentuais
      const totalUsage = appUsage.reduce((sum, app) => sum + (app.duration || 0), 0);

      return appUsage
        .map(app => ({
          id: app.packageName,
          name: app.appName,
          icon: getAppIcon(app.appName),
          percent: totalUsage > 0 ? Math.round(((app.duration || 0) / totalUsage) * 100) : 0,
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 5);
    } catch (error) {
      console.error('Erro ao obter top apps:', error);
      return [];
    }
  };

  const getAppIcon = (appName: string): string => {
    const iconMap: { [key: string]: string } = {
      Instagram: "image",
      TikTok: "video",
      YouTube: "play-circle",
      WhatsApp: "message",
      Facebook: "facebook",
      Twitter: "twitter",
      default: "application",
    };
    return iconMap[appName] || iconMap.default;
  };

  const handleGenerateMockData = async () => {
    try {
      const screenTimeService = ScreenTimeService.getInstance();
      await screenTimeService.generateMockData(7); // Gera dados para 7 dias
      Alert.alert('Sucesso', 'Dados de exemplo gerados! Recarregando...');
      await loadData(); // Recarrega os dados após a geração
    } catch (error) {
      console.error('Erro ao gerar dados mock:', error);
      Alert.alert('Erro', 'Não foi possível gerar dados de exemplo.');
    }
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'Tem certeza que deseja apagar todos os dados de uso? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              const screenTimeService = ScreenTimeService.getInstance();
              const databaseService = DatabaseService.getInstance();
              
              // Limpar dados de uso
              await databaseService.clearAllUsageData();
              
              // Resetar streak
              const gamificationService = GamificationService.getInstance();
              await gamificationService.resetStreak();
              
              Alert.alert('Sucesso', 'Todos os dados foram apagados. Recarregando...');
              await loadData(); // Recarrega os dados após a limpeza
            } catch (error) {
              console.error('Erro ao apagar dados:', error);
              Alert.alert('Erro', 'Erro ao apagar dados.');
            }
          }
        }
      ]
    );
  };

  // Função para formatar o label do eixo Y como "h min" SEM casas decimais e sempre mostrando horas (ex: 0h 45min, 1h, 2h 10min)
  function formatYAxisLabel(yLabel: string) {
    try {
      const value = Math.round(Number(yLabel));
      if (isNaN(value)) return '0h 0min';
      
      const h = Math.floor(value / 60);
      const m = value % 60;
      if (h > 0 && m > 0) return `${h}h ${m}min`;
      if (h > 0) return `${h}h`;
      return `0h ${m}min`;
    } catch (error) {
      return '0h 0min';
    }
  }

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
        <View style={styles.loadingContainer}>
          <Typography variant="bodyLarge" style={{ color: semanticColors.textPrimary }}>
            Carregando dados...
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
        <View style={styles.errorContainer}>
          <Typography variant="bodyLarge" style={{ color: semanticColors.error, textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Typography>
          <Button
            title="Tentar Novamente"
            onPress={loadData}
            style={{ backgroundColor: semanticColors.primary }}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <View style={styles.header}>
        <Typography
          variant="headlineLarge"
          style={[styles.title, { color: semanticColors.textPrimary }]}
        >
          Gráficos de Uso
        </Typography>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'daily' && styles.periodButtonSelected]}
            onPress={() => setSelectedPeriod('daily')}
          >
            <MaterialCommunityIcons name="calendar-today" size={20} color={selectedPeriod === 'daily' ? palette.white : semanticColors.primary} />
            <Text style={[styles.periodButtonText, selectedPeriod === 'daily' && styles.periodButtonTextSelected]}>Diário</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'weekly' && styles.periodButtonSelected]}
            onPress={() => setSelectedPeriod('weekly')}
          >
            <MaterialCommunityIcons name="calendar-week" size={20} color={selectedPeriod === 'weekly' ? palette.white : semanticColors.primary} />
            <Text style={[styles.periodButtonText, selectedPeriod === 'weekly' && styles.periodButtonTextSelected]}>Semanal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'monthly' && styles.periodButtonSelected]}
            onPress={() => setSelectedPeriod('monthly')}
          >
            <MaterialCommunityIcons name="calendar-month" size={20} color={selectedPeriod === 'monthly' ? palette.white : semanticColors.primary} />
            <Text style={[styles.periodButtonText, selectedPeriod === 'monthly' && styles.periodButtonTextSelected]}>Mensal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartCard}>
          {chartData.labels.length > 0 ? (
            <>
              <View style={styles.goalInfo}>
                <Typography variant="titleMedium" style={[styles.goalTitle, { color: semanticColors.textPrimary }]}>
                  Sua Meta Diária
                </Typography>
                <Typography variant="headlineSmall" style={[styles.goalValue, { color: semanticColors.primary }]}>
                  {Math.floor(userGoal / 3600)}h {Math.floor((userGoal % 3600) / 60)}min
                </Typography>
                {dailySummary && (
                  <Typography variant="bodyMedium" style={[styles.goalProgress, { color: semanticColors.textSecondary }]}>
                    Uso atual: {FormatDailyUsage(dailySummary.totalUsage)} 
                    ({Math.round((dailySummary.totalUsage / userGoal) * 100)}% da meta)
                  </Typography>
                )}
              </View>
              <UsageLineChart data={chartData} period={selectedPeriod} formatYAxisLabel={formatYAxisLabel} />
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Typography variant="bodyLarge" style={{ color: semanticColors.textSecondary, textAlign: 'center' }}>
                Nenhum dado disponível para o período selecionado
              </Typography>
              <Typography variant="bodyMedium" style={{ color: semanticColors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                Sua meta diária: {FormatDailyUsage(userGoal)}
              </Typography>
            </View>
          )}
        </View>

        {/* Botões de Debug - Apenas os essenciais */}
        <View style={styles.debugSection}>
          <Typography variant="titleMedium" style={[styles.debugTitle, { color: semanticColors.textPrimary }]}>
            Ferramentas de Debug
          </Typography>
          
          <Button
            title="Gerar Dados de Exemplo"
            onPress={handleGenerateMockData}
            style={[styles.debugButton, { backgroundColor: semanticColors.primary, marginTop: 0 }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
          
          <Button
            title="Apagar Todos os Dados"
            onPress={handleClearAllData}
            style={[styles.debugButton, { backgroundColor: semanticColors.error, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onError }}
          />
        </View>

        <View style={styles.appsList}>
          <Typography variant="titleMedium" style={[styles.sectionTitle, { color: semanticColors.textPrimary }]}>
            Apps Mais Utilizados
            <Typography variant="bodySmall" style={{ color: semanticColors.textSecondary, fontWeight: 'normal' }}>
              {selectedPeriod === 'daily' ? ' (Hoje)' : 
               selectedPeriod === 'weekly' ? ' (Últimos 7 dias)' : 
               ' (Últimos 30 dias)'}
            </Typography>
          </Typography>
          {getTopApps().length > 0 ? (
            getTopApps().map((app) => (
              <View key={app.id} style={styles.appRow}>
                <IconButton icon={app.icon} size={28} iconColor={semanticColors.primary} style={styles.appIcon} />
                <Typography style={styles.appName}>{app.name}</Typography>
                <Typography style={styles.appPercent}>{app.percent}%</Typography>
              </View>
            ))
          ) : (
            <Typography variant="bodyMedium" style={{ color: semanticColors.textSecondary, textAlign: 'center' }}>
              Nenhum app utilizado ainda
            </Typography>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 32,
    marginLeft: -28,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  chartCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 16,
    marginVertical: 16,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  appsList: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  appIcon: {
    backgroundColor: "transparent",
    margin: 0,
    marginRight: 12,
    fontSize: 28,
  },
  appName: {
    fontWeight: "bold",
    fontSize: 18,
    color: semanticColors.primary,
    flex: 1,
  },
  appPercent: {
    fontWeight: "bold",
    fontSize: 18,
    color: semanticColors.textSecondary,
    marginLeft: 8,
  },
  mockButton: {
    marginTop: 16,
  },
  periodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  periodButtonSelected: {
    backgroundColor: semanticColors.primary,
  },
  periodButtonText: {
    marginLeft: 6,
    color: semanticColors.primary,
    fontWeight: "bold",
  },
  periodButtonTextSelected: {
    color: palette.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  goalInfo: {
    marginBottom: 16,
    alignItems: 'center',
  },
  goalTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goalValue: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  goalProgress: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  debugSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: palette.white,
    borderRadius: 24,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  debugTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugButton: {
    marginTop: 8,
  },
});

export default UsageChartsScreen;
