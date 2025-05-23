import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { palette } from '../../theme/colors';
import { useAuth } from '../../App';

// Definição dos tipos das rotas do dashboard
type DashboardStackParamList = {
  Dashboard: undefined;
  UsageCharts: undefined;
  UsageGoal: undefined;
  ReflectiveDiary: undefined;
};

const DashboardScreen = () => {
  const [reflection, setReflection] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  const { login } = useAuth();

  const menuItems = [
    { title: 'Início', icon: 'home', onPress: () => navigation.navigate('Dashboard') },
    { title: 'Perfil', icon: 'account', onPress: () => navigation.navigate('Profile' as never) },
    { title: 'Configurações', icon: 'cog', onPress: () => navigation.navigate('Settings' as never) },
    { title: 'Sair', icon: 'logout', onPress: () => login() },
  ];

  const MenuModal = () => (
    <Modal
      visible={showMenu}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMenu(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowMenu(false)}
      >
        <View style={[styles.menuContainer, { backgroundColor: palette.white }]}>
          <View style={[styles.menuHeader, { borderBottomColor: palette.purpleLight }]}>
            <Typography variant="headlineSmall" style={{ color: palette.black }}>
              Menu
            </Typography>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowMenu(false)}
              iconColor={palette.black}
            />
          </View>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                item.onPress();
              }}
            >
              <IconButton
                icon={item.icon}
                size={24}
                iconColor={palette.purpleDark}
                style={styles.menuItemIcon}
              />
              <Typography variant="bodyLarge" style={{ color: palette.black }}>
                {item.title}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: palette.backgroundMain }}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="menu" 
          size={36} 
          iconColor={palette.purpleDark} 
          style={[styles.menuButton, { backgroundColor: palette.purpleLight }]} 
          onPress={() => setShowMenu(true)}
        />
      </View>
      <MenuModal />
      {/* Saudação */}
      <Typography variant="headlineMedium" style={[styles.greeting, { color: palette.black, fontWeight: 'bold', fontSize: 40 }]}>Bem-vindo, João</Typography>
      {/* Bloco de tempo de uso */}
      <View style={[styles.usageBlock, { backgroundColor: palette.usageCardGradientStart }] }>
        <IconButton icon="clock-outline" size={48} iconColor={palette.usageIconBlue} style={{ marginRight: 16, backgroundColor: 'transparent' }} />
        <View>
          <Typography variant="labelLarge" style={[styles.usageLabel, { color: palette.black, fontWeight: 'bold', fontSize: 22 }]}>Tempo de Uso hoje</Typography>
          <Typography variant="headlineMedium" style={[styles.usageTime, { color: palette.black, fontWeight: 'bold', fontSize: 34 }]}>3h 20min</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="labelSmall" style={[styles.usageGoal, { color: palette.black, fontWeight: 'bold' }]}>Meta diária</Typography>
            <Typography variant="labelSmall" style={[styles.usageContinue, { color: palette.blueStrong, marginLeft: 4 }]}> continue focado!</Typography>
          </View>
        </View>
      </View>
      {/* Botões de funcionalidades */}
      <View style={styles.featuresRow}>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: palette.orangeLight }]} onPress={() => navigation.navigate('UsageGoal')}>
          <IconButton icon="target" size={36} iconColor={palette.orangeDark} style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: palette.orangeDark, fontWeight: 'bold', fontSize: 22 }]}>Metas de Uso</Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.featuresRow}>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: palette.purpleLight }]} onPress={() => navigation.navigate('UsageCharts')}>
          <IconButton icon="chart-bar" size={36} iconColor={palette.purpleDark} style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: palette.purpleDark, fontWeight: 'bold', fontSize: 22 }]}>Gráficos de Uso</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.featureCard, { backgroundColor: palette.greenLight }]} onPress={() => navigation.navigate('ReflectiveDiary')}>
          <IconButton icon="book-open-variant" size={36} iconColor={palette.greenDark} style={{ backgroundColor: 'transparent', margin: 0 }} />
          <Typography variant="labelLarge" style={[styles.featureText, { color: palette.greenDark, fontWeight: 'bold', fontSize: 22 }]}>Diário Reflexivo</Typography>
        </TouchableOpacity>
      </View>
      {/* Área de reflexão */}
      <View style={[styles.reflectionBlock, { backgroundColor: palette.white }] }>
        <Typography variant="labelLarge" style={[styles.reflectionLabel, { color: palette.black, fontWeight: 'bold', fontSize: 22 }]}>Como foi seu uso hoje?</Typography>
        <TextInput
          style={[styles.textArea, { backgroundColor: palette.inputBg, color: palette.black }]}
          placeholder="Hoje usei muito o Instagram e Youtube. Me distraí durante os estudos."
          placeholderTextColor={palette.black + '99'}
          value={reflection}
          onChangeText={setReflection}
          multiline
          numberOfLines={3}
        />
        <Button
          title="salvar reflexão"
          style={[styles.saveButton, { backgroundColor: palette.orangeButton }]}
          labelStyle={{ color: palette.white, fontWeight: 'bold', fontSize: 20 }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 8,
  },
  menuButton: {
    borderRadius: 16,
    padding: 16,
  },
  greeting: {
    marginBottom: 24,
    marginLeft: 8,
  },
  usageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 8,
  },
  usageLabel: {},
  usageTime: {},
  usageGoal: {},
  usageContinue: {},
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: 8,
  },
  featureCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 32,
    marginHorizontal: 8,
    elevation: 0,
  },
  featureText: {
    marginTop: 8,
    textAlign: 'center',
  },
  reflectionBlock: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 18,
    marginBottom: 24,
    marginHorizontal: 8,
    elevation: 0,
  },
  reflectionLabel: {
    marginBottom: 12,
  },
  textArea: {
    borderRadius: 16,
    padding: 16,
    minHeight: 60,
    color: palette.black,
    marginBottom: 16,
    fontSize: 18,
  },
  saveButton: {
    borderRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: palette.white,
    elevation: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  menuItemIcon: {
    marginRight: 16,
  },
});

export default DashboardScreen; 