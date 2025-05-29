import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';
import ScreenTimeService, { AppUsage, DailySummary } from '../../services/ScreenTimeService';
import UsageLineChart from '../../components/charts/UsageLineChart';
import Button from '../../components/common/Button';

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
    const labels = [];
    const data = [];

    if (selectedPeriod === 'daily') {
      // Agrupar por hora
      const hourlyData = new Array(24).fill(0);
      appUsage.forEach(usage => {
        const hour = new Date(usage.startTime).getHours();
        hourlyData[hour] += usage.duration / 60; // Converter para minutos
      });

      for (let i = 0; i < 24; i++) {
        labels.push(`${i}h`);
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
      for (let i = 0; i < 7; i++) {
        labels.push(days[i]);
        data.push(dailyData[i]);
      }
    } else {
      // Agrupar por semana
      const weeklyData = new Array(4).fill(0);
      appUsage.forEach(usage => {
        const week = Math.floor(new Date(usage.startTime).getDate() / 7);
        weeklyData[week] += usage.duration / 60;
      });

      for (let i = 0; i < 4; i++) {
        labels.push(`Sem ${i + 1}`);
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
          <IconButton
            icon="calendar-today"
            size={24}
            iconColor={selectedPeriod === 'daily' ? semanticColors.primary : semanticColors.textSecondary}
            onPress={() => setSelectedPeriod('daily')}
          />
          <IconButton
            icon="calendar-week"
            size={24}
            iconColor={selectedPeriod === 'weekly' ? semanticColors.primary : semanticColors.textSecondary}
            onPress={() => setSelectedPeriod('weekly')}
          />
          <IconButton
            icon="calendar-month"
            size={24}
            iconColor={selectedPeriod === 'monthly' ? semanticColors.primary : semanticColors.textSecondary}
            onPress={() => setSelectedPeriod('monthly')}
          />
        </View>

        <View style={[styles.chartContainer, { backgroundColor: semanticColors.secondaryContainer }]}>
          <UsageLineChart data={getChartData()} period={selectedPeriod} />
        </View>

        <View style={styles.appsList}>
          <Typography variant="titleMedium" style={[styles.sectionTitle, { color: semanticColors.textPrimary }]}>
            Apps Mais Utilizados
          </Typography>
          {getTopApps().map((app) => (
            <View key={app.id} style={styles.appRow}>
              <IconButton icon={app.icon} size={24} iconColor={semanticColors.primary} style={styles.appIcon} />
              <Text style={[styles.appName, { color: semanticColors.textPrimary }]}>{app.name}</Text>
              <Text style={[styles.appPercent, { color: semanticColors.textPrimary }]}>{app.percent}%</Text>
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
    marginBottom: 16,
  },
  chartContainer: {
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    overflow: 'hidden',
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
  },
  appIcon: {
    backgroundColor: 'transparent',
    margin: 0,
    marginRight: 12,
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
  },
  appPercent: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
  },
  mockButton: {
    marginBottom: 16,
  },
});

export default UsageChartsScreen; 