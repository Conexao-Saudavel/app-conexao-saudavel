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
import SyncService from '../../services/SyncService';

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
      let startDate: string;

      switch (selectedPeriod) {
        case 'daily':
          startDate = today;
          break;
        case 'weekly':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'monthly':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        default:
          startDate = today;
      }

      // Carregar dados reais do Digital Wellbeing
      await screenTimeService.startMonitoring();

      // Obter resumo diário
      const summary = await screenTimeService.getDailySummary(today);
      setDailySummary(summary);

      // Obter histórico de uso
      const usageHistory = await screenTimeService.getAppUsageHistory(startDate, today);
      setAppUsage(usageHistory || []);
      
      // Processar dados para o gráfico
      const processedChartData = processChartData(usageHistory || []);
      setChartData(processedChartData);
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
        setUserGoal(parseFloat(goalHours) * 60); // Converter para minutos
      }
    } catch (error) {
      console.error('Erro ao carregar meta do usuário:', error);
    }
  };

  const processChartData = (usageHistory: AppUsage[]): ChartData => {
    try {
      if (!usageHistory || usageHistory.length === 0) {
        return {
          labels: [],
          datasets: [{ data: [] }]
        };
      }

      const dailyData: { [key: string]: number } = {};
      
      usageHistory.forEach(usage => {
        if (usage && usage.startTime) {
          const date = new Date(usage.startTime).toISOString().split('T')[0];
          if (!dailyData[date]) {
            dailyData[date] = 0;
          }
          dailyData[date] += (usage.duration || 0) / 60; // Converter para minutos
        }
      });

      const labels = Object.keys(dailyData).sort();
      const data = labels.map(date => dailyData[date]);

      return {
        labels,
        datasets: [{ data }]
      };
    } catch (error) {
      console.error('Erro ao processar dados do gráfico:', error);
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
  };

  const getChartData = () => {
    try {
      let labels: string[] = [];
      const data: number[] = [];

      if (selectedPeriod === 'daily') {
        // Agrupar por hora
        const hourlyData = new Array(24).fill(0);
        appUsage.forEach(usage => {
          if (usage && usage.startTime) {
            const hour = new Date(usage.startTime).getHours();
            hourlyData[hour] += (usage.duration || 0) / 60; // Converter para minutos
          }
        });

        // Labels simplificados: apenas 0h, 6h, 12h, 18h, 24h
        labels = Array(24).fill('');
        [0, 6, 12, 18, 23].forEach(h => {
          labels[h] = h === 23 ? '24h' : `${h}h`;
        });
        for (let i = 0; i < 24; i++) {
          data.push(hourlyData[i]);
        }
      } else if (selectedPeriod === 'weekly') {
        // Agrupar por dia
        const dailyData = new Array(7).fill(0);
        appUsage.forEach(usage => {
          if (usage && usage.startTime) {
            const day = new Date(usage.startTime).getDay();
            dailyData[day] += (usage.duration || 0) / 60;
          }
        });

        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        labels = days;
        for (let i = 0; i < 7; i++) {
          data.push(dailyData[i]);
        }
      } else {
        // Agrupar por semana
        const weeklyData = new Array(4).fill(0);
        appUsage.forEach(usage => {
          if (usage && usage.startTime) {
            const week = Math.floor(new Date(usage.startTime).getDate() / 7);
            weeklyData[week] += (usage.duration || 0) / 60;
          }
        });

        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        for (let i = 0; i < 4; i++) {
          data.push(weeklyData[i]);
        }
      }

      return {
        labels,
        datasets: [{ data }],
      };
    } catch (error) {
      console.error('Erro ao gerar dados do gráfico:', error);
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
  };

  const getTopApps = () => {
    try {
      if (!dailySummary || !dailySummary.appBreakdown) return [];

      return Object.entries(dailySummary.appBreakdown)
        .map(([packageName, data]) => ({
          id: packageName,
          name: data.name || 'App Desconhecido',
          icon: getAppIcon(data.name),
          percent: Math.round(((data.duration || 0) / (dailySummary.totalUsage || 1)) * 100),
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

  const handleForceReload = async () => {
    try {
      setLoading(true);
      await loadData();
      Alert.alert('Sucesso', 'Dados recarregados!');
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      Alert.alert('Erro', 'Erro ao recarregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestDataCollection = async () => {
    try {
      const screenTimeService = ScreenTimeService.getInstance();
      await screenTimeService.testDataCollection();
      Alert.alert('Teste', 'Verifique os logs no console para ver o resultado do teste.');
    } catch (error) {
      console.error('Erro no teste:', error);
      Alert.alert('Erro', 'Erro ao executar teste de coleta de dados.');
    }
  };

  const handleCheckPermissions = async () => {
    try {
      const screenTimeService = ScreenTimeService.getInstance();
      const hasAccess = await screenTimeService.checkWellbeingAccess();
      Alert.alert(
        'Status das Permissões', 
        `Acesso ao Digital Wellbeing: ${hasAccess ? 'Concedido' : 'Não concedido'}`
      );
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      Alert.alert('Erro', 'Erro ao verificar permissões.');
    }
  };

  const handleRequestPermissions = async () => {
    try {
      const screenTimeService = ScreenTimeService.getInstance();
      const granted = await screenTimeService.ensureWellbeingAccess();
      
      if (granted) {
        Alert.alert('Sucesso', 'Permissão concedida! Os dados serão coletados automaticamente.');
        await loadData(); // Recarregar dados
      } else {
        Alert.alert(
          'Permissão Necessária', 
          'Para coletar dados de uso, você precisa conceder permissão nas configurações do sistema.\n\n' +
          'Vá em: Configurações > Digital Wellbeing > Acesso ao uso > Conexão Saudável'
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Alert.alert('Erro', 'Erro ao solicitar permissões.');
    }
  };

  const handleResetOnboarding = async () => {
    try {
      const databaseService = DatabaseService.getInstance();
      await databaseService.resetOnboarding();
      Alert.alert('Sucesso', 'Onboarding resetado. Reinicie o app para ver o onboarding novamente.');
    } catch (error) {
      console.error('Erro ao resetar onboarding:', error);
      Alert.alert('Erro', 'Erro ao resetar onboarding.');
    }
  };

  const handleCheckOnboardingStatus = async () => {
    try {
      const databaseService = DatabaseService.getInstance();
      const allSettings = await databaseService.getAllSettings();
      const firstRun = await databaseService.getSetting('first_run');
      
      let statusText = `first_run: '${firstRun}' (tipo: ${typeof firstRun})\n\nConfigurações atuais:\n`;
      allSettings.forEach(setting => {
        statusText += `- ${setting.key}: '${setting.value}'\n`;
      });
      
      Alert.alert('Status do Onboarding', statusText);
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      Alert.alert('Erro', 'Erro ao verificar status do onboarding.');
    }
  };

  const handleForceOnboardingTrue = async () => {
    try {
      const databaseService = DatabaseService.getInstance();
      await databaseService.setSetting('first_run', 'true');
      Alert.alert('Sucesso', 'first_run definido como true. Reinicie o app para ver o onboarding.');
    } catch (error) {
      console.error('Erro ao definir first_run:', error);
      Alert.alert('Erro', 'Erro ao definir first_run.');
    }
  };

  const handleRecreateDatabase = async () => {
    Alert.alert(
      'Recriar Banco de Dados',
      'Tem certeza que deseja recriar completamente o banco de dados? Todos os dados serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recriar',
          style: 'destructive',
          onPress: async () => {
            try {
              const databaseService = DatabaseService.getInstance();
              await databaseService.recreateDatabase();
              Alert.alert('Sucesso', 'Banco de dados recriado. Reinicie o app para ver as mudanças.');
            } catch (error) {
              console.error('Erro ao recriar banco de dados:', error);
              Alert.alert('Erro', 'Erro ao recriar banco de dados.');
            }
          }
        }
      ]
    );
  };

  const handleClearIncorrectPermission = async () => {
    try {
      const databaseService = DatabaseService.getInstance();
      await databaseService.setSetting('has_wellbeing_access', 'false');
      Alert.alert('Sucesso', 'Permissão incorreta foi limpa. Agora você pode solicitar permissão novamente.');
    } catch (error) {
      console.error('Erro ao limpar permissão:', error);
      Alert.alert('Erro', 'Erro ao limpar permissão.');
    }
  };

  const handleTestNativeModule = async () => {
    try {
      const screenTimeService = ScreenTimeService.getInstance();
      
      // Testar verificação de módulos
      screenTimeService.checkNativeModules();
      
      // Testar verificação de permissão
      const hasAccess = await screenTimeService.checkWellbeingAccess();
      
      Alert.alert(
        'Teste do Módulo Nativo',
        `Verificação de permissão: ${hasAccess ? 'Concedida' : 'Não concedida'}\n\nVerifique os logs no console para mais detalhes.`
      );
    } catch (error) {
      console.error('Erro ao testar módulo nativo:', error);
      Alert.alert('Erro', 'Erro ao testar módulo nativo.');
    }
  };

  const handleTestFilteredDataCollection = async () => {
    try {
      const screenTimeService = ScreenTimeService.getInstance();
      
      // Usar o método público
      await screenTimeService.testFilteredDataCollection();
      
      // Verificar dados salvos
      const today = new Date().toISOString().split('T')[0];
      const savedData = await screenTimeService.getAppUsageHistory(today, today);
      
      // Mostrar resumo dos dados
      let summary = `Dados coletados: ${savedData.length} apps\n\n`;
      
      const topApps = savedData
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);
      
      topApps.forEach((app, index) => {
        const hours = Math.floor(app.duration / 3600);
        const minutes = Math.floor((app.duration % 3600) / 60);
        summary += `${index + 1}. ${app.appName}: ${hours}h ${minutes}m\n`;
      });
      
      Alert.alert('Teste de Coleta Filtrada', summary);
    } catch (error) {
      console.error('Erro ao testar coleta filtrada:', error);
      Alert.alert('Erro', 'Erro ao testar coleta de dados filtrada.');
    }
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'Tem certeza que deseja apagar todos os dados coletados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              const databaseService = DatabaseService.getInstance();
              await databaseService.clearAllUsageData();
              Alert.alert('Sucesso', 'Todos os dados foram apagados.');
              await loadData(); // Recarregar dados
            } catch (error) {
              console.error('Erro ao apagar dados:', error);
              Alert.alert('Erro', 'Erro ao apagar dados.');
            }
          }
        }
      ]
    );
  };

  const handleSyncData = async () => {
    try {
      const syncService = SyncService.getInstance();
      const result = await syncService.syncData();
      
      if (result.success) {
        Alert.alert(
          'Sincronização Concluída', 
          `Sincronizados ${result.syncedCount} registros com sucesso.`
        );
      } else {
        Alert.alert('Erro na Sincronização', result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      Alert.alert('Erro', 'Erro ao sincronizar dados.');
    }
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
                  {Math.floor(userGoal / 60)}h {userGoal % 60}min
                </Typography>
                {dailySummary && (
                  <Typography variant="bodyMedium" style={[styles.goalProgress, { color: semanticColors.textSecondary }]}>
                    Uso atual: {Math.floor(dailySummary.totalUsage / 60)}h {dailySummary.totalUsage % 60}min 
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
                Sua meta diária: {Math.floor(userGoal / 60)}h {userGoal % 60}min
              </Typography>
            </View>
          )}
        </View>

        {/* Botões de Debug - Sempre visíveis */}
        <View style={styles.debugSection}>
          <Typography variant="titleMedium" style={[styles.debugTitle, { color: semanticColors.textPrimary }]}>
            Ferramentas de Debug
          </Typography>
          
          <Button
            title="Gerar Dados de Exemplo"
            onPress={handleGenerateMockData}
            style={[styles.debugButton, { backgroundColor: semanticColors.primary }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
          
          <Button
            title="Recarregar Dados"
            onPress={handleForceReload}
            style={[styles.debugButton, { backgroundColor: semanticColors.primary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
          
          <Button
            title="Testar Coleta de Dados"
            onPress={handleTestDataCollection}
            style={[styles.debugButton, { backgroundColor: semanticColors.secondary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onSecondary }}
          />
          
          <Button
            title="Verificar Permissões"
            onPress={handleCheckPermissions}
            style={[styles.debugButton, { backgroundColor: semanticColors.secondary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onSecondary }}
          />
          
          <Button
            title="Solicitar Permissões"
            onPress={handleRequestPermissions}
            style={[styles.debugButton, { backgroundColor: semanticColors.primary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
          
          <Button
            title="Sincronizar Dados"
            onPress={handleSyncData}
            style={[styles.debugButton, { backgroundColor: semanticColors.secondary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onSecondary }}
          />
          
          <Button
            title="Apagar Todos os Dados"
            onPress={handleClearAllData}
            style={[styles.debugButton, { backgroundColor: semanticColors.error, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onError }}
          />
          
          <Button
            title="Resetar Onboarding (Dev)"
            onPress={handleResetOnboarding}
            style={[styles.debugButton, { backgroundColor: semanticColors.error, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onError }}
          />
          
          <Button
            title="Verificar Status Onboarding"
            onPress={handleCheckOnboardingStatus}
            style={[styles.debugButton, { backgroundColor: semanticColors.secondary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onSecondary }}
          />
          
          <Button
            title="Forçar Onboarding True"
            onPress={handleForceOnboardingTrue}
            style={[styles.debugButton, { backgroundColor: semanticColors.primary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
          
          <Button
            title="Recriar Banco de Dados"
            onPress={handleRecreateDatabase}
            style={[styles.debugButton, { backgroundColor: semanticColors.error, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onError }}
          />
          
          <Button
            title="Limpar Permissão Incorreta"
            onPress={handleClearIncorrectPermission}
            style={[styles.debugButton, { backgroundColor: semanticColors.secondary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onSecondary }}
          />
          
          <Button
            title="Testar Módulo Nativo"
            onPress={handleTestNativeModule}
            style={[styles.debugButton, { backgroundColor: semanticColors.primary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />
          
          <Button
            title="Testar Coleta Filtrada"
            onPress={handleTestFilteredDataCollection}
            style={[styles.debugButton, { backgroundColor: semanticColors.secondary, marginTop: 8 }]}
            labelStyle={{ color: semanticColors.onSecondary }}
          />
        </View>

        <View style={styles.appsList}>
          <Typography variant="titleMedium" style={[styles.sectionTitle, { color: semanticColors.textPrimary }]}>
            Apps Mais Utilizados
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
    marginTop: 20,
    padding: 16,
  },
  debugTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  debugButton: {
    marginBottom: 8,
  },
});

export default UsageChartsScreen;
