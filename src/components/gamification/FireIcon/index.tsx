import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../common/Typography';
import { palette } from '../../../theme/colors';

interface FireIconProps {
  isActive: boolean;
  consecutiveDays: number;
}

const FireIcon: React.FC<FireIconProps> = ({ isActive, consecutiveDays }) => {
  return (
    <View style={styles.fireContainer}>
      <Typography variant="headlineMedium" style={[
        styles.fireIcon, 
        { 
          color: isActive ? palette.orangeButton : palette.grey400,
          opacity: isActive ? 1 : 0.5
        }
      ]}>
        🔥
      </Typography>
      <Typography variant="labelLarge" style={[styles.fireText, { color: palette.black, fontWeight: 'bold' }]}>
        {consecutiveDays} dias consecutivos
      </Typography>
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
    fontSize: 48,
  },
  fireText: {
    marginLeft: 8,
    fontSize: 18,
  },
});

export default FireIcon; 