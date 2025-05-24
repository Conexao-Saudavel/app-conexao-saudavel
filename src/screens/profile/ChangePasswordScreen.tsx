import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { semanticColors } from '../../theme/colors';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, watch } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = (data: any) => {
    // Implementar lógica de alteração de senha
    console.log(data);
    navigation.goBack();
  };

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background }}>
      <ScrollView>
        <View style={styles.header}>
          <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>
            Alterar Senha
          </Typography>
        </View>

        <View style={styles.form}>
          <InputField
            name="currentPassword"
            control={control}
            label="Senha Atual"
            secureTextEntry={!showCurrentPassword}
            left={<IconButton icon="lock" size={20} iconColor={semanticColors.primary} style={styles.inputIcon} />}
            right={
              <TouchableOpacity onPress={() => setShowCurrentPassword((v) => !v)}>
                <IconButton
                  icon={showCurrentPassword ? 'eye' : 'eye-off'}
                  size={20}
                  iconColor={semanticColors.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            }
          />

          <InputField
            name="newPassword"
            control={control}
            label="Nova Senha"
            secureTextEntry={!showNewPassword}
            left={<IconButton icon="lock-plus" size={20} iconColor={semanticColors.primary} style={styles.inputIcon} />}
            right={
              <TouchableOpacity onPress={() => setShowNewPassword((v) => !v)}>
                <IconButton
                  icon={showNewPassword ? 'eye' : 'eye-off'}
                  size={20}
                  iconColor={semanticColors.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            }
          />

          <InputField
            name="confirmPassword"
            control={control}
            label="Confirmar Nova Senha"
            secureTextEntry={!showConfirmPassword}
            left={<IconButton icon="lock-check" size={20} iconColor={semanticColors.primary} style={styles.inputIcon} />}
            right={
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                <IconButton
                  icon={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  iconColor={semanticColors.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            }
          />

          <Button
            title="ALTERAR SENHA"
            onPress={handleSubmit(onSubmit)}
            style={[styles.button, { backgroundColor: semanticColors.primary }]}
            labelStyle={{ color: semanticColors.onPrimary }}
          />

          <Button
            title="CANCELAR"
            onPress={() => navigation.goBack()}
            style={[styles.button, { backgroundColor: semanticColors.surfaceVariant }]}
            labelStyle={{ color: semanticColors.onSurfaceVariant }}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  inputIcon: {
    marginTop: 8,
    marginLeft: 0,
    marginRight: -8,
  },
  button: {
    borderRadius: 8,
    marginTop: 16,
  },
});

export default ChangePasswordScreen; 