import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';

const ReflectiveDiaryScreen = () => {
  const [reflection, setReflection] = useState('');

  const handleSave = () => {
    // Aqui você pode salvar a reflexão (ex: API, AsyncStorage, etc)
    alert('Reflexão salva!');
  };

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>Diário Reflexivo</Typography>
      <Typography variant="bodyMedium" style={[styles.subtitle, { color: semanticColors.textSecondary }]}>Escreva sobre seu dia, seus desafios e conquistas.</Typography>
      <TextInput
        style={[styles.textArea, { backgroundColor: semanticColors.surfaceVariant, color: semanticColors.textPrimary }]}
        placeholder="Como foi seu dia?"
        placeholderTextColor={semanticColors.textSecondary}
        value={reflection}
        onChangeText={setReflection}
        multiline
        numberOfLines={6}
      />
      <Button
        title="Salvar Reflexão"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
        labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 24,
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 24,
  },
  saveButton: {
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ReflectiveDiaryScreen; 