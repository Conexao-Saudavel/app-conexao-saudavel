import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { IconButton, Checkbox } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';

const mockApps = [
  {
    id: '1',
    name: 'TikTok',
    icon: require('../../public/assets/tiktok.png'),
  },
  {
    id: '2',
    name: 'Instagram',
    icon: require('../../public/assets/instagram.png'),
  },
  {
    id: '3',
    name: 'Twitter',
    icon: require('../../public/assets/twitter.png'),
  },
  {
    id: '4',
    name: 'Spotify',
    icon: require('../../public/assets/spotify.png'),
  },
];

const BlockAppsScreen = () => {
  const [selectedApps, setSelectedApps] = useState(['1', '2']);
  const [duration, setDuration] = useState(60); // minutos

  const toggleApp = (id: string) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const renderAppItem = ({ item }: any) => (
    <View style={styles.appRow}>
      <Image source={item.icon} style={styles.appIcon} />
      <Typography variant="bodyLarge" style={styles.appName}>{item.name}</Typography>
      <Checkbox.Android
        status={selectedApps.includes(item.id) ? 'checked' : 'unchecked'}
        onPress={() => toggleApp(item.id)}
        color="#FFB37B"
        uncheckedColor="#666"
      />
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#191919', flex: 1 }}>
      <View style={styles.header}>
        <IconButton icon="menu" size={28} iconColor="#fff" style={styles.menuIcon} />
        <IconButton icon="account" size={28} iconColor="#fff" style={styles.avatarIcon} />
      </View>
      <View style={styles.containerBox}>
        <Typography variant="headlineLarge" style={styles.title}>Bloquear Apps</Typography>
        <Typography variant="labelLarge" style={styles.legend}>DURAÇÃO DO BLOQUEIO</Typography>
        <View style={styles.durationRow}>
          <IconButton icon="timer-sand" size={40} iconColor="#FFB37B" style={styles.hourglassIcon} />
          <Typography variant="headlineLarge" style={styles.durationValue}>{`${Math.floor(duration / 60)} hora${duration / 60 > 1 ? 's' : ''}`}</Typography>
        </View>
        <Typography variant="labelLarge" style={styles.appsLegend}>Apps selecionados</Typography>
        <FlatList
          data={mockApps}
          keyExtractor={item => item.id}
          renderItem={renderAppItem}
          style={{ marginBottom: 16 }}
        />
        <Button
          title="INICIAR BLOQUEIO"
          style={styles.blockButton}
          labelStyle={{ color: '#191919', fontWeight: 'bold' }}
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
  menuIcon: {
    backgroundColor: 'transparent',
    marginLeft: 4,
  },
  avatarIcon: {
    backgroundColor: 'transparent',
    marginRight: 4,
  },
  containerBox: {
    backgroundColor: '#191919',
    borderRadius: 24,
    padding: 24,
    margin: 8,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
    fontSize: 28,
  },
  legend: {
    color: '#FFB37B',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
    textAlign: 'left',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hourglassIcon: {
    backgroundColor: 'transparent',
    margin: 0,
    marginRight: 8,
  },
  durationValue: {
    color: '#FFB37B',
    fontWeight: 'bold',
    fontSize: 32,
  },
  appsLegend: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    textAlign: 'left',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
  },
  appName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  blockButton: {
    backgroundColor: '#FFB37B',
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default BlockAppsScreen; 