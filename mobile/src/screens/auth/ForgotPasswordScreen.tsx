import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { semanticColors } from '../../theme/colors';

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = (email: string) => {
    setLoading(true);
    // Aqui você pode chamar sua API de recuperação de senha
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Recuperação de Senha', 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.');
      navigation.goBack();
    }, 1500);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background }}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} onPress={() => navigation.goBack()} />
        <Typography variant="headlineMedium" style={styles.title}>Recuperar Senha</Typography>
      </View>
      <ForgotPasswordForm onSubmit={handleSubmit} isLoading={loading} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen; 