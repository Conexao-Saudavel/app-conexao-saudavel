import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../common/Typography';
import { useAuth } from '../../contexts/AuthContext';
import { palette, semanticColors } from '../../theme/colors';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose, navigation }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ translateX: isOpen ? 0 : -300 }] }
    ]}>
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          iconColor={semanticColors.primary}
          onPress={onClose}
          style={styles.closeButton}
        />
        <Typography variant="titleLarge" style={[styles.title, { color: semanticColors.primary }]}>
          Menu
        </Typography>
      </View>

      <View style={styles.content}>
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Profile');
              onClose();
            }}
          >
            <IconButton
              icon="account"
              size={24}
              iconColor={semanticColors.primary}
              style={styles.menuIcon}
            />
            <Typography variant="bodyLarge" style={[styles.menuLabel, { color: semanticColors.textPrimary }]}>
              Perfil
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('ReflectionHistory');
              onClose();
            }}
          >
            <IconButton
              icon="book-open-variant"
              size={24}
              iconColor={semanticColors.primary}
              style={styles.menuIcon}
            />
            <Typography variant="bodyLarge" style={[styles.menuLabel, { color: semanticColors.textPrimary }]}>
              Histórico de Reflexões
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('UsageGoal');
              onClose();
            }}
          >
            <IconButton
              icon="target"
              size={24}
              iconColor={semanticColors.primary}
              style={styles.menuIcon}
            />
            <Typography variant="bodyLarge" style={[styles.menuLabel, { color: semanticColors.textPrimary }]}>
              Metas Diárias
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Help');
              onClose();
            }}
          >
            <IconButton
              icon="help-circle"
              size={24}
              iconColor={semanticColors.primary}
              style={styles.menuIcon}
            />
            <Typography variant="bodyLarge" style={[styles.menuLabel, { color: semanticColors.textPrimary }]}>
              Ajuda
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Settings');
              onClose();
            }}
          >
            <IconButton
              icon="cog"
              size={24}
              iconColor={semanticColors.primary}
              style={styles.menuIcon}
            />
            <Typography variant="bodyLarge" style={[styles.menuLabel, { color: semanticColors.textPrimary }]}>
              Configurações
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <IconButton
              icon="logout"
              size={24}
              iconColor={semanticColors.error}
              style={styles.menuIcon}
            />
            <Typography variant="bodyLarge" style={[styles.menuLabel, { color: semanticColors.error }]}>
              Sair
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.divider} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: semanticColors.background,
    elevation: 16,
    shadowColor: semanticColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.outline,
  },
  closeButton: {
    margin: 0,
  },
  title: {
    marginLeft: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menuItems: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuIcon: {
    margin: 0,
  },
  menuLabel: {
    marginLeft: 12,
  },
  bottomSection: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: semanticColors.outline,
    marginVertical: 16,
  },
});

export default DrawerMenu; 