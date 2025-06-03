import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Avatar, IconButton, Switch } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { semanticColors } from '../../theme/colors';
import { useAuth } from '../../../App';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Dados mockados do usuário (substitua por dados reais posteriormente)
  const userData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    birthDate: '15/05/1990',
    avatar: 'https://via.placeholder.com/150',
  };

  const handleEditProfile = () => {
    // Navegação para tela de edição de perfil
    navigation.navigate('EditProfile' as never);
  };

  const handleChangePassword = () => {
    // Navegação para tela de alteração de senha
    navigation.navigate('ChangePassword' as never);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ScreenWrapper scrollable style={{ backgroundColor: semanticColors.background }}>
      {/* Cabeçalho com Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            source={{ uri: userData.avatar }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <IconButton
              icon="camera"
              size={24}
              iconColor={semanticColors.onPrimary}
              style={styles.editAvatarIcon}
            />
          </TouchableOpacity>
        </View>
        <Typography variant="headlineMedium" style={[styles.name, { color: semanticColors.onBackground }]}>
          {userData.name}
        </Typography>
      </View>

      {/* Informações Pessoais */}
      <View style={styles.section}>
        <Typography variant="titleMedium" style={[styles.sectionTitle, { color: semanticColors.onBackground }]}>
          Informações Pessoais
        </Typography>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <IconButton icon="email" size={24} iconColor={semanticColors.primary} />
            <View style={styles.infoText}>
              <Typography variant="bodySmall" style={{ color: semanticColors.textSecondary }}>
                E-mail
              </Typography>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                {userData.email}
              </Typography>
            </View>
          </View>
          <View style={styles.infoRow}>
            <IconButton icon="calendar" size={24} iconColor={semanticColors.primary} />
            <View style={styles.infoText}>
              <Typography variant="bodySmall" style={{ color: semanticColors.textSecondary }}>
                Data de Nascimento
              </Typography>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                {userData.birthDate}
              </Typography>
            </View>
          </View>
        </View>
        <Button
          title="EDITAR PERFIL"
          onPress={handleEditProfile}
          style={[styles.button, { backgroundColor: semanticColors.primary }]}
          labelStyle={{ color: semanticColors.onPrimary }}
        />
      </View>

      {/* Configurações da Conta */}
      <View style={styles.section}>
        <Typography variant="titleMedium" style={[styles.sectionTitle, { color: semanticColors.onBackground }]}>
          Configurações da Conta
        </Typography>
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
            <IconButton icon="lock" size={24} iconColor={semanticColors.primary} />
            <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
              Alterar Senha
            </Typography>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <IconButton icon="bell" size={24} iconColor={semanticColors.primary} />
            <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
              Notificações
            </Typography>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={semanticColors.primary}
            />
          </View>

          <View style={styles.settingRow}>
            <IconButton icon="theme-light-dark" size={24} iconColor={semanticColors.primary} />
            <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
              Modo Escuro
            </Typography>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              color={semanticColors.primary}
            />
          </View>
        </View>
      </View>

      {/* Botão de Logout */}
      <Button
        title="SAIR"
        onPress={handleLogout}
        style={[styles.logoutButton, { backgroundColor: semanticColors.error }]}
        labelStyle={{ color: semanticColors.onError }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#e1e1e1',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFB37B',
    borderRadius: 20,
  },
  editAvatarIcon: {
    margin: 0,
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    borderRadius: 8,
    marginTop: 8,
  },
  settingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 8,
  },
});

export default ProfileScreen; 