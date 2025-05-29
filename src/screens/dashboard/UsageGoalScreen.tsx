import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Slider from '@react-native-community/slider';
import { semanticColors } from '../../theme/colors';
import ScreenTimeService, { AppUsage, DailySummary } from '../../services/ScreenTimeService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UsageGoalScreen = () => {
  const [dailyGoal, setDailyGoal] = useState(180); // minutos
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);

  useEffect(() => {
    loadData();
    loadGoal();
  }, []);

  const loadData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const screenTimeService = ScreenTimeService.getInstance();

    // Carregar resumo diário
    const summary = await screenTimeService.getDailySummary(today);
    setDailySummary(summary);

    // Carregar histórico de uso do dia
    const usage = await screenTimeService.getAppUsageHistory(today, today);
    setAppUsage(usage);
  };

  const loadGoal = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem('daily_goal');
      if (savedGoal) {
        setDailyGoal(parseInt(savedGoal));
      }
    } catch (error) {
      console.error('Erro ao carregar meta:', error);
    }
  };

  const saveGoal = async () => {
    try {
      await AsyncStorage.setItem('daily_goal', dailyGoal.toString());
      // Atualizar o resumo diário com a nova meta
      if (dailySummary) {
        const updatedSummary = {
          ...dailySummary,
          goalCompletion: Math.min((dailySummary.totalUsage / (dailyGoal * 60)) * 100, 100),
        };
        await AsyncStorage.setItem(`daily_summary_${dailySummary.date}`, JSON.stringify(updatedSummary));
        setDailySummary(updatedSummary);
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const getAppUsageList = () => {
    if (!dailySummary) return [];

    return Object.entries(dailySummary.appBreakdown)
      .map(([packageName, data]) => ({
        id: packageName,
        name: data.name,
        icon: getAppIcon(data.name),
        time: Math.round(data.duration / 60), // Converter para minutos
      }))
      .sort((a, b) => b.time - a.time);
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

  const renderAppItem = ({ item }: any) => (
    <View style={styles.appRow}>
      <IconButton icon={item.icon} size={24} iconColor={semanticColors.primary} style={styles.appIcon} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.appName, { color: semanticColors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.appTime, { color: semanticColors.textSecondary }]}>
          {Math.floor(item.time / 60) > 0 ? `${Math.floor(item.time / 60)} h ` : ''}
          {item.time % 60 > 0 ? `${item.time % 60} min` : ''}
        </Text>
      </View>
      <Text style={[styles.editGoal, { color: semanticColors.primary }]}>Editar Meta</Text>
      <IconButton icon="chevron-right" size={20} iconColor={semanticColors.primary} style={{ margin: 0, backgroundColor: 'transparent' }} />
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>
        Meta Diária de Tempo de Uso
      </Typography>
      <Typography variant="labelLarge" style={[styles.legend, { color: semanticColors.textSecondary }]}>
        META DIÁRIA DE TEMPO DE USO
      </Typography>
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={600}
          step={10}
          value={dailyGoal}
          onValueChange={setDailyGoal}
          minimumTrackTintColor={semanticColors.primary}
          maximumTrackTintColor={semanticColors.outline}
          thumbTintColor={semanticColors.primary}
        />
        <Text style={[styles.sliderValue, { color: semanticColors.primary }]}>
          {`${Math.floor(dailyGoal / 60)} h ${dailyGoal % 60} min`}
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
      <FlatList
        data={getAppUsageList()}
        keyExtractor={item => item.id}
        renderItem={renderAppItem}
        style={{ marginBottom: 16 }}
      />
      <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
      <Typography variant="labelLarge" style={[styles.statusLegend, { color: semanticColors.textSecondary }]}>
        STATUS DAS METAS HOJE
      </Typography>
      <View style={styles.statusRow}>
        <IconButton icon="medal" size={28} iconColor={semanticColors.primary} style={styles.medalIcon} />
        <View style={[styles.progressBarBg, { backgroundColor: semanticColors.outline }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${dailySummary?.goalCompletion || 0}%`,
                backgroundColor: semanticColors.primary,
              },
            ]}
          />
        </View>
      </View>
      <Button
        title="SALVAR METAS"
        onPress={saveGoal}
        style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
        labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'left',
    fontSize: 24,
  },
  legend: {
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 14,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    marginRight: 12,
  },
  sliderValue: {
    fontWeight: 'bold',
    fontSize: 18,
    minWidth: 80,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: semanticColors.outline,
  },
  appIcon: {
    backgroundColor: 'transparent',
    margin: 0,
    marginRight: 12,
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appTime: {
    fontSize: 14,
  },
  editGoal: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  statusLegend: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  medalIcon: {
    backgroundColor: 'transparent',
    margin: 0,
    marginRight: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 8,
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default UsageGoalScreen;
