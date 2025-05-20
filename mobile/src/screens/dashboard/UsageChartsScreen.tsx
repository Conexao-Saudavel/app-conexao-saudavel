import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';

const mockApps = [
  {
    id: '1',
    name: 'TikTok',
    icon: require('../../public/assets/tiktok.png'),
    percent: 32,
  },
  {
    id: '2',
    name: 'Instagram',
    icon: require('../../public/assets/instagram.png'),
    percent: 25,
  },
  {
    id: '3',
    name: 'YouTube',
    icon: require('../../public/assets/youtube.png'),
    percent: 14,
  },
];

const barData = [1.2, 2.1, 4, 2.8, 1.5]; // em horas
const barColors = ['#B6A6F6', '#B6A6F6', '#FFB37B', '#B6A6F6', '#B6A6F6'];
const days = ['S', 'T', 'Q', 'Q', 'S'];

const UsageChartsScreen = () => {
  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <View style={styles.header}>
        <IconButton icon="menu" size={28} iconColor="#fff" style={styles.menuIcon} />
        <Typography variant="headlineLarge" style={styles.title}>Gráficos de Uso</Typography>
        <IconButton icon="account" size={28} iconColor="#fff" style={styles.avatarIcon} />
      </View>
      <View style={[styles.chartContainer, { backgroundColor: semanticColors.tertiary }] }>
        {/* Eixo Y */}
        <View style={styles.yLabels}>
          <Text style={styles.yLabel}>4h</Text>
          <Text style={styles.yLabel}>2h</Text>
          <Text style={styles.yLabel}>0h</Text>
        </View>
        {/* Gráfico de barras */}
        <View style={styles.barsArea}>
          <View style={styles.barsBg}>
            {barData.map((value, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(value / 4) * 100}%`,
                      backgroundColor: idx === 2 ? semanticColors.primary : semanticColors.tertiary,
                    },
                  ]}
                />
                <Text style={[styles.dayLabel, { color: semanticColors.onTertiary }]}>{days[idx]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      {/* Lista de apps */}
      <View style={{ marginTop: 32 }}>
        {mockApps.map((app) => (
          <View key={app.id} style={styles.appRow}>
            <Image source={app.icon} style={styles.appIcon} />
            <Text style={[styles.appName, { color: semanticColors.onTertiary }]}>{app.name}</Text>
            <Text style={[styles.appPercent, { color: semanticColors.onTertiary }]}>{app.percent}%</Text>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  menuIcon: {
    backgroundColor: 'transparent',
    marginLeft: 4,
  },
  avatarIcon: {
    backgroundColor: 'transparent',
    marginRight: 4,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontSize: 32,
    marginLeft: -28, // para compensar o espaço do menu
  },
  chartContainer: {
    backgroundColor: '#B6A6F6',
    borderRadius: 24,
    marginHorizontal: 8,
    marginTop: 8,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 180,
  },
  yLabels: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginLeft: 12,
    marginRight: 8,
  },
  yLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
  },
  barsBg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginRight: 16,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    opacity: 0.8,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginHorizontal: 16,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 16,
  },
  appName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
  },
  appPercent: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
  },
});

export default UsageChartsScreen; 