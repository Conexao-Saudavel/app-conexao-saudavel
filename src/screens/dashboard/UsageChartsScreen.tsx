import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { palette, semanticColors } from '../../theme/colors';
import ScreenTimeService, { AppUsage, DailySummary } from '../../services/ScreenTimeService';
import UsageLineChart from '../../components/charts/UsageLineChart';
import Button from '../../components/common/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UsageChartsScreen = () => {
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const screenTimeService = ScreenTimeService.getInstance();

    // Carregar resumo diário
    const summary = await screenTimeService.getDailySummary(today);
    setDailySummary(summary);

    // Carregar histórico de uso
    const startDate = new Date();
    if (selectedPeriod === 'daily') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (selectedPeriod === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const usage = await screenTimeService.getAppUsageHistory(
      startDate.toISOString().split('T')[0],
      today
    );
    setAppUsage(usage);
  };

  const getChartData = () => {
    let labels: string[] = [];
    const data: number[] = [];

    if (selectedPeriod === 'daily') {
      // Agrupar por hora
      const hourlyData = new Array(24).fill(0);
      appUsage.forEach(usage => {
        const hour = new Date(usage.startTime).getHours();
        hourlyData[hour] += usage.duration / 60; // Converter para minutos
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
        const day = new Date(usage.startTime).getDay();
        dailyData[day] += usage.duration / 60;
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
        const week = Math.floor(new Date(usage.startTime).getDate() / 7);
        weeklyData[week] += usage.duration / 60;
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
  };

  const getTopApps = () => {
    if (!dailySummary) return [];

    return Object.entries(dailySummary.appBreakdown)
      .map(([packageName, data]) => ({
        id: packageName,
        name: data.name,
        icon: getAppIcon(data.name),
        percent: Math.round((data.duration / dailySummary.totalUsage) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  };

  const getAppIcon = (appName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Instagram': 'image',
      'TikTok': 'video',
      'YouTube': 'play-circle',
      'WhatsApp': 'message',
      'Facebook': 'facebook',
      'Twitter': 'twitter',
      'default': 'application',
    };
    return iconMap[appName] || iconMap.default;
  };

  const handleGenerateMockData = async () => {
    const screenTimeService = ScreenTimeService.getInstance();
    await screenTimeService.generateMockData(7); // Gera dados para 7 dias
    await loadData(); // Recarrega os dados após a geração
  };

  // Função para formatar o label do eixo Y como "h min" SEM casas decimais e sempre mostrando horas (ex: 0h 45min, 1h, 2h 10min)
  function formatYAxisLabel(value: number) {
    const rounded = Math.round(value);
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `0h ${m}min`;
  }

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <View style={styles.header}>
        <Typography variant="headlineLarge" style={[styles.title, { color: semanticColors.textPrimary }]}>
          Gráficos de Uso
        </Typography>
      </View>

      <ScrollView style={styles.content}>
        <Button
          title="Gerar Dados de Teste"
          onPress={handleGenerateMockData}
          style={styles.mockButton}
        />

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
          <UsageLineChart data={getChartData()} period={selectedPeriod} formatYAxisLabel={formatYAxisLabel} />
        </View>

        <View style={styles.appsList}>
          <Typography variant="titleMedium" style={[styles.sectionTitle, { color: semanticColors.textPrimary }]}>
            Apps Mais Utilizados
          </Typography>
          {getTopApps().map((app) => (
            <View key={app.id} style={styles.appRow}>
              <IconButton icon={app.icon} size={28} iconColor={semanticColors.primary} style={styles.appIcon} />
              <Typography style={styles.appName}>{app.name}</Typography>
              <Typography style={styles.appPercent}>{app.percent}%</Typography>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    marginLeft: -28,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    fontWeight: 'bold',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  appIcon: {
    backgroundColor: 'transparent',
    margin: 0,
    marginRight: 12,
    fontSize: 28,
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: semanticColors.primary,
    flex: 1,
  },
  appPercent: {
    fontWeight: 'bold',
    fontSize: 18,
    color: semanticColors.textSecondary,
    marginLeft: 8,
  },
  mockButton: {
    marginBottom: 16,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    fontWeight: 'bold',
  },
  periodButtonTextSelected: {
    color: palette.white,
  },
});

export default UsageChartsScreen; 