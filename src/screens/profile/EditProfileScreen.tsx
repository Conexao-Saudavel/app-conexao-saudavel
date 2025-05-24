import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { semanticColors } from '../../theme/colors';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      birthDate: '15/05/1990',
    },
  });

  const onSubmit = (data: any) => {
    // Implementar lógica de atualização do perfil
    console.log(data);
    navigation.goBack();
  };

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background }}>
      <ScrollView>
        <View style={styles.header}>
          <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>
            Editar Perfil
          </Typography>
        </View>

        <View style={styles.form}>
          <InputField
            name="name"
            control={control}
            label="Nome Completo"
            left={<IconButton icon="account" size={20} iconColor={semanticColors.primary} style={styles.inputIcon} />}
          />

          <InputField
            name="email"
            control={control}
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<IconButton icon="email" size={20} iconColor={semanticColors.primary} style={styles.inputIcon} />}
          />

          <InputField
            name="birthDate"
            control={control}
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            left={<IconButton icon="calendar" size={20} iconColor={semanticColors.primary} style={styles.inputIcon} />}
          />

          <Button
            title="SALVAR ALTERAÇÕES"
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

export default EditProfileScreen; 