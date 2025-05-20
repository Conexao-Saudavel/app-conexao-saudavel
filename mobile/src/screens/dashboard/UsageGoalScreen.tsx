import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Slider from '@react-native-community/slider';
import { semanticColors } from '../../theme/colors';

const mockApps = [
  {
    id: '1',
    name: 'TikTok',
    icon: require('../../public/assets/tiktok.png'),
    time: 30, // minutos
  },
  {
    id: '2',
    name: 'Instagram',
    icon: require('../../public/assets/instagram.png'),
    time: 60,
  },
  {
    id: '3',
    name: 'YouTube',
    icon: require('../../public/assets/youtube.png'),
    time: 90,
  },
];

const UsageGoalScreen = () => {
  const [dailyGoal, setDailyGoal] = useState(180); // minutos
  const [progress, setProgress] = useState(0.5); // 50% exemplo

  const renderAppItem = ({ item }: any) => (
    <View style={styles.appRow}>
      <Image source={item.icon} style={styles.appIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.appName}>{item.name}</Text>
        <Text style={styles.appTime}>{Math.floor(item.time / 60) > 0 ? `${Math.floor(item.time / 60)} h ` : ''}{item.time % 60 > 0 ? `${item.time % 60} min` : ''}</Text>
      </View>
      <Text style={styles.editGoal}>Editar Meta</Text>
      <IconButton icon="chevron-right" size={20} iconColor="#A3FF7A" style={{ margin: 0, backgroundColor: 'transparent' }} />
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>Meta Diária de Tempo de Uso</Typography>
      <Typography variant="labelLarge" style={[styles.legend, { color: semanticColors.textSecondary }]}>META DIÁRIA DE TEMPO DE USO</Typography>
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
        <Text style={[styles.sliderValue, { color: semanticColors.primary }]}>{`${Math.floor(dailyGoal / 60)} h ${dailyGoal % 60} min`}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
      <FlatList
        data={mockApps}
        keyExtractor={item => item.id}
        renderItem={renderAppItem}
        style={{ marginBottom: 16 }}
      />
      <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
      <Typography variant="labelLarge" style={[styles.statusLegend, { color: semanticColors.textSecondary }]}>STATUS DAS METAS HOJE</Typography>
      <View style={styles.statusRow}>
        <IconButton icon="medal" size={28} iconColor={semanticColors.primary} style={styles.medalIcon} />
        <View style={[styles.progressBarBg, { backgroundColor: semanticColors.outline }] }>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: semanticColors.primary }]} />
        </View>
      </View>
      <Button
        title="SALVAR METAS"
        style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
        labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'left',
    fontSize: 24,
  },
  legend: {
    color: '#666',
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
    color: '#FFB37B',
    fontWeight: 'bold',
    fontSize: 18,
    minWidth: 80,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  appName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  appTime: {
    color: '#aaa',
    fontSize: 14,
  },
  editGoal: {
    color: '#A3FF7A',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  statusLegend: {
    color: '#666',
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
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#FFB37B',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#FFB37B',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default UsageGoalScreen;
