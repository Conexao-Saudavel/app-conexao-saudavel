import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../common/Typography';
import { palette } from '../../../theme/colors';
import { IconButton } from 'react-native-paper';

interface FireIconProps {
  isActive: boolean;
  consecutiveDays: number;
  fireColor?: string;
  motivationalMessage?: string;
}

const FireIcon: React.FC<FireIconProps> = ({ 
  isActive, 
  consecutiveDays, 
  fireColor = palette.orangeButton,
  motivationalMessage 
}) => {
  // Determinar cor baseada no estado e streak
  const getFireColor = () => {
    if (!isActive) return palette.grey400;
    return fireColor;
  };

  // Determinar tamanho baseado no streak
  const getFireSize = () => {
    if (consecutiveDays === 0) return 40;
    if (consecutiveDays <= 3) return 44;
    if (consecutiveDays <= 7) return 48;
    if (consecutiveDays <= 14) return 52;
    if (consecutiveDays <= 30) return 56;
    return 60; // Mais de 30 dias
  };

  // Determinar opacidade baseada no estado
  const getOpacity = () => {
    return isActive ? 1 : 0.5;
  };

  return (
    <View style={styles.fireContainer}>
      <IconButton
        icon="fire"
        size={getFireSize()}
        iconColor={getFireColor()}
        style={[
          styles.fireIcon,
          { 
            opacity: getOpacity(),
            transform: [{ scale: isActive ? 1.1 : 1 }] // Pequena animação quando ativo
          }
        ]}
      />
      <View style={styles.textContainer}>
        <Typography variant="labelLarge" style={[styles.fireText, { color: palette.black, fontWeight: 'bold' }]}>
          {consecutiveDays} dias consecutivos
        </Typography>
        {motivationalMessage && (
          <Typography variant="bodySmall" style={[styles.motivationalText, { color: palette.grey600 }]}>
            {motivationalMessage}
          </Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fireContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: 8,
  },
  fireIcon: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  textContainer: {
    marginLeft: 8,
    flex: 1,
  },
  fireText: {
    fontSize: 18,
    marginBottom: 2,
  },
  motivationalText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default FireIcon; 