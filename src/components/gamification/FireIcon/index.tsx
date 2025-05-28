import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../common/Typography';
import { palette } from '../../../theme/colors';
import { IconButton } from 'react-native-paper';

interface FireIconProps {
  isActive: boolean;
  consecutiveDays: number;
}

const FireIcon: React.FC<FireIconProps> = ({ isActive, consecutiveDays }) => {
  return (
    <View style={styles.fireContainer}>
      <IconButton
        icon="fire"
        size={40}
        iconColor={isActive ? palette.orangeButton : palette.grey400}
        style={[
          styles.fireIcon,
          { opacity: isActive ? 1 : 0.5 }
        ]}
      />
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
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  fireText: {
    marginLeft: 8,
    fontSize: 18,
  },
});

export default FireIcon; 