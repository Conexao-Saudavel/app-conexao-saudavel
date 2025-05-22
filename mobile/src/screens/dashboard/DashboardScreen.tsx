import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { semanticColors } from '../../theme/colors';

// Definição dos tipos das rotas do dashboard
type DashboardStackParamList = {
  Dashboard: undefined;
  UsageCharts: undefined;
  UsageGoal: undefined;
};

const DashboardScreen = () => {
  const [reflection, setReflection] = useState('');
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="menu" size={28} iconColor={semanticColors.onPrimary} style={[styles.menuButton, { backgroundColor: semanticColors.primary }]} />
      </View>
      {/* Saudação */}
      <Typography variant="headlineMedium" style={[styles.greeting, { color: semanticColors.textPrimary }]}>Bem-vindo, João</Typography>
      {/* Bloco de tempo de uso */}
      <View style={[styles.usageBlock, { backgroundColor: semanticColors.primaryContainer }] }>
        <IconButton icon="clock-outline" size={32} iconColor={semanticColors.primary} style={{ marginRight: 0, backgroundColor: 'transparent' }} />
        <View>
          <Typography variant="labelLarge" style={[styles.usageLabel, { color: semanticColors.primary }]}>Tempo de Uso hoje</Typography>
          <Typography variant="headlineMedium" style={[styles.usageTime, { color: semanticColors.textPrimary }]}>3h 20min</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="labelSmall" style={[styles.usageGoal, { color: semanticColors.primary }]}>Meta diária</Typography>
            <Typography variant="labelSmall" style={[styles.usageContinue, { color: semanticColors.secondaryContainer }]}> continue focado!</Typography>
          </View>
        </View>
      </View>
      {/* Botões de funcionalidades */}
      <View style={styles.featuresRow}>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: semanticColors.tertiary }]} onPress={() => navigation.navigate('UsageCharts')}>
          <IconButton icon="chart-bar" size={28} iconColor={semanticColors.onTertiary} style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: semanticColors.onTertiary }]}>Gráficos de Uso</Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.featuresRow}>
        <View style={[styles.featureCard, { backgroundColor: semanticColors.successContainer }]}> 
          <IconButton icon="book-open-variant" size={28} iconColor={semanticColors.success} style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: semanticColors.success }]}>Diário Reflexivo</Typography>
        </View>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: semanticColors.warningContainer }]} onPress={() => navigation.navigate('UsageGoal')}>
          <IconButton icon="target" size={28} iconColor={semanticColors.warning} style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: semanticColors.warning }]}>Metas de Uso</Typography>
        </TouchableOpacity>
      </View>
      {/* Área de reflexão */}
      <View style={[styles.reflectionBlock, { backgroundColor: semanticColors.surface }] }>
        <Typography variant="labelLarge" style={[styles.reflectionLabel, { color: semanticColors.textPrimary }]}>Como foi seu uso hoje?</Typography>
        <TextInput
          style={[styles.textArea, { backgroundColor: semanticColors.surfaceVariant, color: semanticColors.textPrimary }]}
          placeholder="Hoje usei muito o Instagram e Youtube. MMe distrai durante os estudos."
          placeholderTextColor={semanticColors.textSecondary}
          value={reflection}
          onChangeText={setReflection}
          multiline
          numberOfLines={3}
        />
        <Button
          title="salvar reflexão"
          style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
          labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  menuButton: {
    backgroundColor: semanticColors.primary,
    borderRadius: 8,
    padding: 8,
  },
  greeting: {
    color: semanticColors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },
  usageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticColors.primaryContainer,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  usageLabel: {
    color: semanticColors.primary,
    fontWeight: 'bold',
  },
  usageTime: {
    color: semanticColors.textPrimary,
    fontWeight: 'bold',
    fontSize: 24,
  },
  usageGoal: {
    color: semanticColors.primary,
    fontWeight: 'bold',
  },
  usageContinue: {
    color: semanticColors.secondaryContainer,
    marginLeft: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 6,
    elevation: 2,
  },
  featureText: {
    color: semanticColors.onSecondary,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  reflectionBlock: {
    backgroundColor: semanticColors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    marginBottom: 24,
    elevation: 1,
  },
  reflectionLabel: {
    color: semanticColors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: semanticColors.surfaceVariant,
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    color: semanticColors.textPrimary,
    marginBottom: 12,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: semanticColors.primary,
    borderRadius: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default DashboardScreen; 