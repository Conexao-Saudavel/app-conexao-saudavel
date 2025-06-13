import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, IconButton, Switch } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import CredentialStorage from '../../services/storage/credentialStorage';
import { semanticColors } from '../../theme/colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, userData, loadUserData } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDataFromContext();
  }, []);

  const loadUserDataFromContext = async () => {
    try {
      setLoading(true);
      console.log('ProfileScreen: Iniciando carregamento de dados...');
      await loadUserData();
      console.log('ProfileScreen: Dados carregados com sucesso');
    } catch (error) {
      console.error('ProfileScreen: Erro ao carregar dados do usuário:', error);
      // Não mostrar alerta aqui, apenas logar o erro
      // Os dados mockados serão exibidos automaticamente
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informado';
    
    // Se a data vier no formato yyyy-MM-dd, converter para dd/MM/yyyy
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return dateString;
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword' as never);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleClearSavedCredentials = () => {
    Alert.alert(
      'Limpar Credenciais Salvas',
      'Tem certeza que deseja remover suas credenciais salvas? Você precisará digitar seu e-mail e senha na próxima vez que fizer login.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await CredentialStorage.clearCredentials();
              Alert.alert('Sucesso', 'Credenciais salvas foram removidas.');
            } catch (error) {
              console.error('Erro ao limpar credenciais:', error);
              Alert.alert('Erro', 'Não foi possível limpar as credenciais salvas.');
            }
          }
        }
      ]
    );
  };

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
    <ScreenWrapper scrollable style={{ backgroundColor: semanticColors.background }}>
      {/* Cabeçalho com Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            source={{ 
              uri: userData?.avatar_url || 'https://via.placeholder.com/150'
            }}
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
          {userData?.full_name || 'Usuário'}
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
                {userData?.email || 'Não informado'}
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
                {formatDate(userData?.date_of_birth || '')}
              </Typography>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconButton icon="account" size={24} iconColor={semanticColors.primary} />
            <View style={styles.infoText}>
              <Typography variant="bodySmall" style={{ color: semanticColors.textSecondary }}>
                Gênero
              </Typography>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                {userData?.gender || 'Não informado'}
              </Typography>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconButton icon="school" size={24} iconColor={semanticColors.primary} />
            <View style={styles.infoText}>
              <Typography variant="bodySmall" style={{ color: semanticColors.textSecondary }}>
                Tipo de Usuário
              </Typography>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                {userData?.user_type || 'Não informado'}
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
            <View style={styles.settingText}>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                Alterar Senha
              </Typography>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={semanticColors.primary} />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <IconButton icon="bell" size={24} iconColor={semanticColors.primary} />
            <View style={styles.settingText}>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                Notificações
              </Typography>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={semanticColors.primary}
            />
          </View>

          <View style={styles.settingRow}>
            <IconButton icon="theme-light-dark" size={24} iconColor={semanticColors.primary} />
            <View style={styles.settingText}>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                Modo Escuro
              </Typography>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              color={semanticColors.primary}
            />
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={handleClearSavedCredentials}>
            <IconButton icon="key-remove" size={24} iconColor={semanticColors.primary} />
            <View style={styles.settingText}>
              <Typography variant="bodyMedium" style={{ color: semanticColors.onBackground }}>
                Limpar Credenciais Salvas
              </Typography>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor={semanticColors.primary} />
          </TouchableOpacity>
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
    textAlign: 'center',
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
  settingText: {
    flex: 1,
    marginLeft: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 8,
  },
});

export default ProfileScreen; 