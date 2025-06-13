import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Alert, Modal, TextInput as RNTextInput, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Slider from '@react-native-community/slider';
import { semanticColors } from '../../theme/colors';
import ScreenTimeService, { AppUsage, DailySummary } from '../../services/ScreenTimeService';
import DatabaseService from '../../services/DatabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APPS_KEY = 'user_apps';
const APP_GOALS_KEY = 'user_app_goals';

const UsageGoalScreen = () => {
  const [dailyGoal, setDailyGoal] = useState(240); // minutos (4 horas padrão)
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [saving, setSaving] = useState(false);
  const [customApps, setCustomApps] = useState<any[]>([]);
  const [showAddApp, setShowAddApp] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [appGoals, setAppGoals] = useState<{ [key: string]: number }>({});
  const [editAppId, setEditAppId] = useState<string | null>(null);
  const [editAppValue, setEditAppValue] = useState(60);
  const [editAppName, setEditAppName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadGoal(),
        loadDailyData(),
        loadCustomApps(),
        loadAppGoals()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadDailyData = async () => {
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
      const databaseService = DatabaseService.getInstance();
      const savedGoalHours = await databaseService.getSetting('daily_goal_hours');
      if (savedGoalHours) {
        const goalSeconds = parseFloat(savedGoalHours) * 3600; // Converter para segundos
        setDailyGoal(goalSeconds);
      }
    } catch (error) {
      console.error('Erro ao carregar meta:', error);
    }
  };

  const loadCustomApps = async () => {
    try {
      const data = await AsyncStorage.getItem(APPS_KEY);
      if (data) setCustomApps(JSON.parse(data));
      else setCustomApps([]);
    } catch (error) {
      console.error('Erro ao carregar apps customizados:', error);
      setCustomApps([]);
    }
  };

  const loadAppGoals = async () => {
    try {
      const data = await AsyncStorage.getItem(APP_GOALS_KEY);
      if (data) setAppGoals(JSON.parse(data));
      else setAppGoals({});
    } catch (error) {
      console.error('Erro ao carregar metas dos apps:', error);
      setAppGoals({});
    }
  };

  const handleAddApp = async () => {
    if (!newAppName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para o aplicativo.');
      return;
    }

    try {
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
      Alert.alert('Sucesso', 'Aplicativo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar app:', error);
      Alert.alert('Erro', 'Erro ao adicionar aplicativo. Tente novamente.');
    }
  };

  const handleEditAppGoal = (id: string, name: string) => {
    setEditAppId(id);
    setEditAppName(name);
    setEditAppValue(appGoals[id] || 60);
  };

  const handleSaveAppGoal = async () => {
    if (!editAppId) return;

    try {
      const updated = { ...appGoals, [editAppId]: editAppValue };
      setAppGoals(updated);
      await AsyncStorage.setItem(APP_GOALS_KEY, JSON.stringify(updated));
      setEditAppId(null);
      setEditAppName('');
      Alert.alert('Sucesso', 'Meta do aplicativo salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar meta do app:', error);
      Alert.alert('Erro', 'Erro ao salvar meta do aplicativo. Tente novamente.');
    }
  };

  const handleDeleteAppGoal = async (id: string) => {
    Alert.alert(
      'Remover Meta',
      'Tem certeza que deseja remover a meta deste aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = { ...appGoals };
              delete updated[id];
              setAppGoals(updated);
              await AsyncStorage.setItem(APP_GOALS_KEY, JSON.stringify(updated));
              Alert.alert('Sucesso', 'Meta removida com sucesso!');
            } catch (error) {
              console.error('Erro ao remover meta:', error);
              Alert.alert('Erro', 'Erro ao remover meta. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const saveGoal = async () => {
    try {
      setSaving(true);
      
      // Salvar no DatabaseService (integração com o resto do sistema)
      const databaseService = DatabaseService.getInstance();
      const goalHours = (dailyGoal / 3600).toString(); // Converter de segundos para horas
      await databaseService.setSetting('daily_goal_hours', goalHours);
      
      // Atualizar o resumo diário com a nova meta
      if (dailySummary) {
        const updatedSummary = {
          ...dailySummary,
          goalCompletion: Math.min((dailySummary.totalUsage / dailyGoal) * 100, 100), // dailyGoal já está em segundos
        };
        await databaseService.saveDailySummary(updatedSummary);
        setDailySummary(updatedSummary);
      }

      Alert.alert('Meta salva!', 'Sua meta diária foi atualizada com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      Alert.alert('Erro', 'Erro ao salvar meta. Tente novamente.');
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
        currentUsage: data.duration,
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

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getAppProgressColor = (appId: string): string => {
    const app = allApps.find(a => a.id === appId);
    if (!app || !appGoals[appId]) return semanticColors.textSecondary;
    
    const currentUsage = app.currentUsage || 0;
    const goalSeconds = appGoals[appId] * 60; // appGoals está em minutos, converter para segundos
    const progress = (currentUsage / goalSeconds) * 100;
    
    if (progress >= 100) return semanticColors.error;
    if (progress >= 80) return semanticColors.warning;
    return semanticColors.success;
  };

  // Barra de progresso visual
  const progress = dailySummary && dailyGoal > 0 ? Math.min((dailySummary.totalUsage / dailyGoal) * 100, 100) : 0;
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

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="bodyLarge" style={{ color: semanticColors.textSecondary }}>
          Carregando...
        </Typography>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            {formatTime(dailyGoal)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Typography variant="titleMedium" style={{ color: semanticColors.onBackground, flex: 1 }}>
            Apps Monitorados
          </Typography>
          <Button 
            title="Adicionar App" 
            onPress={() => setShowAddApp(true)} 
            style={{ borderRadius: 8, backgroundColor: semanticColors.primary }} 
            labelStyle={{ color: semanticColors.onPrimary }} 
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          {allApps.map((item) => (
            <View key={item.id} style={styles.appRow}>
              <IconButton icon={item.icon} size={24} iconColor={semanticColors.primary} style={styles.appIcon} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.appName, { color: semanticColors.textPrimary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.appTime, { color: semanticColors.textSecondary }]}> 
                  {appGoals[item.id] 
                    ? `Meta: ${formatTime(appGoals[item.id])} | Uso: ${formatTime(Math.round((item.currentUsage || 0) / 60))}`
                    : 'Sem meta definida'
                  }
                </Text>
                {appGoals[item.id] && (
                  <View style={[styles.appProgressBar, { backgroundColor: semanticColors.outline }]}>
                    <View
                      style={[
                        styles.appProgressFill,
                        {
                          width: `${Math.min(((item.currentUsage || 0) / (appGoals[item.id] * 60)) * 100, 100)}%`,
                          backgroundColor: getAppProgressColor(item.id),
                        },
                      ]}
                    />
                  </View>
                )}
              </View>
              <View style={styles.appActions}>
                <Text 
                  style={[styles.editGoal, { color: semanticColors.primary }]} 
                  onPress={() => handleEditAppGoal(item.id, item.name)}
                >
                  {appGoals[item.id] ? 'Editar' : 'Definir'}
                </Text>
                {appGoals[item.id] && (
                  <IconButton 
                    icon="delete" 
                    size={20} 
                    iconColor={semanticColors.error} 
                    style={{ margin: 0, backgroundColor: 'transparent' }} 
                    onPress={() => handleDeleteAppGoal(item.id)} 
                  />
                )}
                <IconButton 
                  icon="chevron-right" 
                  size={20} 
                  iconColor={semanticColors.primary} 
                  style={{ margin: 0, backgroundColor: 'transparent' }} 
                  onPress={() => handleEditAppGoal(item.id, item.name)} 
                />
              </View>
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
        
        <Typography style={{ color: progressColor, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
          {feedbackText}
        </Typography>
        
        <Button
          title={saving ? 'Salvando...' : 'SALVAR METAS'}
          onPress={saveGoal}
          style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
          labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
          disabled={saving}
        />
      </ScrollView>

      {/* Modal para adicionar app */}
      <Modal visible={showAddApp} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: semanticColors.surface, borderRadius: 16, padding: 24, width: '80%' }}>
            <Typography variant="titleMedium" style={{ marginBottom: 12, color: semanticColors.onBackground }}>
              Adicionar Aplicativo
            </Typography>
            <RNTextInput
              placeholder="Nome do aplicativo"
              value={newAppName}
              onChangeText={setNewAppName}
              style={{ 
                borderWidth: 1, 
                borderColor: semanticColors.outline, 
                borderRadius: 8, 
                padding: 12, 
                marginBottom: 16, 
                color: semanticColors.textPrimary,
                fontSize: 16
              }}
              placeholderTextColor={semanticColors.textSecondary}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button 
                title="Cancelar" 
                onPress={() => setShowAddApp(false)} 
                style={{ borderRadius: 8, backgroundColor: semanticColors.surfaceVariant }} 
                labelStyle={{ color: semanticColors.onSurfaceVariant }} 
              />
              <Button 
                title="Adicionar" 
                onPress={handleAddApp} 
                style={{ borderRadius: 8, backgroundColor: semanticColors.primary }} 
                labelStyle={{ color: semanticColors.onPrimary }} 
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar meta individual */}
      <Modal visible={!!editAppId} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: semanticColors.surface, borderRadius: 16, padding: 24, width: '80%' }}>
            <Typography variant="titleMedium" style={{ marginBottom: 12, color: semanticColors.onBackground }}>
              Meta para {editAppName}
            </Typography>
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
            <Text style={{ 
              color: semanticColors.primary, 
              fontWeight: 'bold', 
              fontSize: 18, 
              textAlign: 'center', 
              marginBottom: 16 
            }}>
              {formatTime(editAppValue)}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button 
                title="Cancelar" 
                onPress={() => {
                  setEditAppId(null);
                  setEditAppName('');
                }} 
                style={{ borderRadius: 8, backgroundColor: semanticColors.surfaceVariant }} 
                labelStyle={{ color: semanticColors.onSurfaceVariant }} 
              />
              <Button 
                title="Salvar" 
                onPress={handleSaveAppGoal} 
                style={{ borderRadius: 8, backgroundColor: semanticColors.primary }} 
                labelStyle={{ color: semanticColors.onPrimary }} 
              />
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
    paddingVertical: 12,
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
    marginBottom: 2,
  },
  appTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  appProgressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  appProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  appActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
