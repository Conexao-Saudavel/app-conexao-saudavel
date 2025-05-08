// src/components/auth/TermsCheckbox.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, Text, useTheme } from 'react-native-paper';
import { Control, Controller, FieldError } from 'react-hook-form';
import Typography from '../common/Typography'; // Usando nosso componente de tipografia

interface TermsCheckboxProps {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError;
  onTermsPress: () => void;
  onPolicyPress: () => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  name,
  control,
  error,
  onTermsPress,
  onPolicyPress,
}) => {
  const { colors } = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <Checkbox.Android
            status={value ? 'checked' : 'unchecked'}
            onPress={() => onChange(!value)}
            color={colors.primary}
          />
          <View style={styles.textContainer}>
            <Typography variant="bodyMedium" style={{ flexShrink: 1 }}>
              Eu li e aceito os{' '}
              <Text style={[styles.link, { color: colors.primary }]} onPress={onTermsPress}>
                Termos de Uso
              </Text>
              {' '}e a{' '}
              <Text style={[styles.link, { color: colors.primary }]} onPress={onPolicyPress}>
                Política de Privacidade
              </Text>
              .
            </Typography>
          </View>
          {error && (
            <Typography variant="bodyMedium" style={{ color: colors.error, marginTop: 4 }}>
              {error.message}
            </Typography>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  textContainer: {
    marginLeft: 8,
    flex: 1, // Para permitir quebra de linha
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default TermsCheckbox;