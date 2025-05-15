import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Definição dos tipos das rotas do dashboard
type DashboardStackParamList = {
  Dashboard: undefined;
  BlockApps: undefined;
  UsageCharts: undefined;
  UsageGoal: undefined;
};

const DashboardScreen = () => {
  const [reflection, setReflection] = useState('');
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();

  return (
    <ScreenWrapper style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="menu" size={28} iconColor="#fff" style={[styles.menuButton, { backgroundColor: '#6C6CA6' }]} />
        <View style={[styles.avatarCircle, { backgroundColor: '#6C6CA6' }] }>
          <IconButton icon="account" size={28} iconColor="#fff" style={{ backgroundColor: 'transparent', margin: 0 }} />
        </View>
      </View>
      {/* Saudação */}
      <Typography variant="headlineMedium" style={[styles.greeting, { color: '#2D2D2D' }]}>Bem-vindo, João</Typography>
      {/* Bloco de tempo de uso */}
      <View style={[styles.usageBlock, { backgroundColor: '#E3E6F3' }] }>
        <IconButton icon="clock-outline" size={32} iconColor="#6C6CA6" style={{ marginRight: 0, backgroundColor: 'transparent' }} />
        <View>
          <Typography variant="labelLarge" style={[styles.usageLabel, { color: '#6C6CA6' }]}>Tempo de Uso hoje</Typography>
          <Typography variant="headlineMedium" style={[styles.usageTime, { color: '#2D2D2D' }]}>3h 20min</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="labelSmall" style={[styles.usageGoal, { color: '#6C6CA6' }]}>Meta diária</Typography>
            <Typography variant="labelSmall" style={[styles.usageContinue, { color: '#A6A6D6' }]}> continue focado!</Typography>
          </View>
        </View>
      </View>
      {/* Botões de funcionalidades */}
      <View style={styles.featuresRow}>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: '#FFB37B' }]} onPress={() => navigation.navigate('BlockApps')}>
          <IconButton icon="lock" size={28} iconColor="#fff" style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: '#fff' }]}>Bloquear Apps</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: '#B6A6F6' }]} onPress={() => navigation.navigate('UsageCharts')}>
          <IconButton icon="chart-bar" size={28} iconColor="#fff" style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: '#fff' }]}>Gráficos de Uso</Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.featuresRow}>
        <View style={[styles.featureCard, { backgroundColor: '#C7E8C8' }]}> 
          <IconButton icon="book-open-variant" size={28} iconColor="#6C6CA6" style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: '#6C6CA6' }]}>Diário Reflexivo</Typography>
        </View>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: '#AEE3F6' }]} onPress={() => navigation.navigate('UsageGoal')}>
          <IconButton icon="target" size={28} iconColor="#6C6CA6" style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: '#6C6CA6' }]}>Metas de Uso</Typography>
        </TouchableOpacity>
      </View>
      {/* Área de reflexão */}
      <View style={[styles.reflectionBlock, { backgroundColor: '#fff' }] }>
        <Typography variant="labelLarge" style={[styles.reflectionLabel, { color: '#2D2D2D' }]}>Como foi seu uso hoje?</Typography>
        <TextInput
          style={[styles.textArea, { backgroundColor: '#F3F5F9', color: '#2D2D2D' }]}
          placeholder="Hoje usei muito o Instagram e Youtube. MMe distrai durante os estudos."
          placeholderTextColor="#888"
          value={reflection}
          onChangeText={setReflection}
          multiline
          numberOfLines={3}
        />
        <Button
          title="salvar reflexão"
          style={[styles.saveButton, { backgroundColor: '#FFB37B' }]}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
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
    backgroundColor: '#6C6CA6',
    borderRadius: 8,
    padding: 8,
  },
  avatarCircle: {
    backgroundColor: '#6C6CA6',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: '#2D2D2D',
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },
  usageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E6F3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  usageLabel: {
    color: '#6C6CA6',
    fontWeight: 'bold',
  },
  usageTime: {
    color: '#2D2D2D',
    fontWeight: 'bold',
    fontSize: 24,
  },
  usageGoal: {
    color: '#6C6CA6',
    fontWeight: 'bold',
  },
  usageContinue: {
    color: '#A6A6D6',
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
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  reflectionBlock: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    marginBottom: 24,
    elevation: 1,
  },
  reflectionLabel: {
    color: '#2D2D2D',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#F3F5F9',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    color: '#2D2D2D',
    marginBottom: 12,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#FFB37B',
    borderRadius: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default DashboardScreen; 