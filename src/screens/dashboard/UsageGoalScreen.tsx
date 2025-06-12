import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Alert, Modal, TextInput as RNTextInput } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Slider from '@react-native-community/slider';
import { semanticColors } from '../../theme/colors';
import ScreenTimeService, { AppUsage, DailySummary } from '../../services/ScreenTimeService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APPS_KEY = 'user_apps';
const APP_GOALS_KEY = 'user_app_goals';

const UsageGoalScreen = () => {
  const [dailyGoal, setDailyGoal] = useState(180); // minutos
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [saving, setSaving] = useState(false);
  const [customApps, setCustomApps] = useState<any[]>([]);
  const [showAddApp, setShowAddApp] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [appGoals, setAppGoals] = useState<{ [key: string]: number }>({});
  const [editAppId, setEditAppId] = useState<string | null>(null);
  const [editAppValue, setEditAppValue] = useState(60);

  useEffect(() => {
    loadData();
    loadGoal();
    loadCustomApps();
    loadAppGoals();
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

  const loadCustomApps = async () => {
    const data = await AsyncStorage.getItem(APPS_KEY);
    if (data) setCustomApps(JSON.parse(data));
    else setCustomApps([]);
  };

  const loadAppGoals = async () => {
    const data = await AsyncStorage.getItem(APP_GOALS_KEY);
    if (data) setAppGoals(JSON.parse(data));
    else setAppGoals({});
  };

  const handleAddApp = async () => {
    if (!newAppName.trim()) return;
    const newApp = {
      id: Date.now().toString(),
      name: newAppName.trim(),
      icon: 'application',
      time: 0,
    };
    const updated = [newApp, ...customApps];
    setCustomApps(updated);
    await AsyncStorage.setItem(APPS_KEY, JSON.stringify(updated));
    setNewAppName('');
    setShowAddApp(false);
  };

  const handleEditAppGoal = (id: string) => {
    setEditAppId(id);
    setEditAppValue(appGoals[id] || 60);
  };

  const handleSaveAppGoal = async () => {
    if (!editAppId) return;
    const updated = { ...appGoals, [editAppId]: editAppValue };
    setAppGoals(updated);
    await AsyncStorage.setItem(APP_GOALS_KEY, JSON.stringify(updated));
    setEditAppId(null);
  };

  const saveGoal = async () => {
    try {
      setSaving(true);
      await AsyncStorage.setItem('daily_goal', dailyGoal.toString());
      Alert.alert('Meta salva!', 'Sua meta diária foi atualizada com sucesso.');
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
      Alert.alert('Erro', 'Erro ao salvar meta.');
    } finally {
      setSaving(false);
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

  // Barra de progresso visual
  const progress = dailySummary && dailyGoal > 0 ? Math.min((dailySummary.totalUsage / (dailyGoal * 60)) * 100, 100) : 0;
  let progressColor = semanticColors.success;
  if (progress >= 100) progressColor = semanticColors.error;
  else if (progress >= 80) progressColor = semanticColors.warning;

  // Feedback textual
  let feedbackText = '';
  if (progress >= 100) feedbackText = 'Você ultrapassou sua meta diária.';
  else if (progress >= 80) feedbackText = 'Atenção! Você está próximo da meta.';
  else feedbackText = 'Continue assim!';

  // Unir apps do sistema com os customizados
  const allApps = [...getAppUsageList(), ...customApps];

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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Typography variant="titleMedium" style={{ color: semanticColors.onBackground, flex: 1 }}>Apps Monitorados</Typography>
        <Button title="Adicionar App" onPress={() => setShowAddApp(true)} style={{ borderRadius: 8, backgroundColor: semanticColors.primary }} labelStyle={{ color: semanticColors.onPrimary }} />
      </View>
      <View style={{ marginBottom: 16 }}>
        {allApps.map((item) => (
          <View key={item.id} style={styles.appRow}>
            <IconButton icon={item.icon} size={24} iconColor={semanticColors.primary} style={styles.appIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.appName, { color: semanticColors.textPrimary }]}>{item.name}</Text>
              <Text style={[styles.appTime, { color: semanticColors.textSecondary }]}> 
                {appGoals[item.id] ? `Meta: ${Math.floor(appGoals[item.id] / 60)}h ${appGoals[item.id] % 60}min` : 'Sem meta'}
              </Text>
            </View>
            <Text style={[styles.editGoal, { color: semanticColors.primary }]} onPress={() => handleEditAppGoal(item.id)}>Editar Meta</Text>
            <IconButton icon="chevron-right" size={20} iconColor={semanticColors.primary} style={{ margin: 0, backgroundColor: 'transparent' }} onPress={() => handleEditAppGoal(item.id)} />
          </View>
        ))}
      </View>
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
                width: `${progress}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>
      <Typography style={{ color: progressColor, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{feedbackText}</Typography>
      <Button
        title={saving ? 'Salvando...' : 'SALVAR METAS'}
        onPress={saveGoal}
        style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
        labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
        disabled={saving}
      />
      {/* Modal para adicionar app */}
      <Modal visible={showAddApp} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: semanticColors.surface, borderRadius: 16, padding: 24, width: '80%' }}>
            <Typography variant="titleMedium" style={{ marginBottom: 12, color: semanticColors.onBackground }}>Adicionar Aplicativo</Typography>
            <RNTextInput
              placeholder="Nome do aplicativo"
              value={newAppName}
              onChangeText={setNewAppName}
              style={{ borderWidth: 1, borderColor: semanticColors.outline, borderRadius: 8, padding: 10, marginBottom: 16, color: semanticColors.textPrimary }}
              placeholderTextColor={semanticColors.textSecondary}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button title="Cancelar" onPress={() => setShowAddApp(false)} style={{ borderRadius: 8, backgroundColor: semanticColors.surfaceVariant, marginRight: 8 }} labelStyle={{ color: semanticColors.onSurfaceVariant }} />
              <Button title="Adicionar" onPress={handleAddApp} style={{ borderRadius: 8, backgroundColor: semanticColors.primary }} labelStyle={{ color: semanticColors.onPrimary }} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal para editar meta individual */}
      <Modal visible={!!editAppId} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: semanticColors.surface, borderRadius: 16, padding: 24, width: '80%' }}>
            <Typography variant="titleMedium" style={{ marginBottom: 12, color: semanticColors.onBackground }}>Editar Meta do App</Typography>
            <Slider
              style={{ width: '100%', marginBottom: 16 }}
              minimumValue={10}
              maximumValue={600}
              step={5}
              value={editAppValue}
              onValueChange={setEditAppValue}
              minimumTrackTintColor={semanticColors.primary}
              maximumTrackTintColor={semanticColors.outline}
              thumbTintColor={semanticColors.primary}
            />
            <Text style={{ color: semanticColors.primary, fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 16 }}>{`${Math.floor(editAppValue / 60)} h ${editAppValue % 60} min`}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button title="Cancelar" onPress={() => setEditAppId(null)} style={{ borderRadius: 8, backgroundColor: semanticColors.surfaceVariant, marginRight: 8 }} labelStyle={{ color: semanticColors.onSurfaceVariant }} />
              <Button title="Salvar" onPress={handleSaveAppGoal} style={{ borderRadius: 8, backgroundColor: semanticColors.primary }} labelStyle={{ color: semanticColors.onPrimary }} />
            </View>
          </View>
        </View>
      </Modal>
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
