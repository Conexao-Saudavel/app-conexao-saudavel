import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { Checkbox, IconButton } from 'react-native-paper';
import Typography from '../../components/common/Typography';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../App';
import { semanticColors } from '../../theme/colors';

const logo = require('../../public/assets/logo-sem-fundo.png');

const LoginScreen = () => {
  const { control, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  // Apenas para visual, não faz login real
  const onSubmit = (data: any) => {
    login();
  };

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background }}>
      <View style={styles.header}>
        <View style={styles.logoArea}>
          <Image source={logo} style={styles.logoImg} resizeMode="contain" />
          <Typography variant="labelLarge" style={[styles.logoText, { color: semanticColors.primary }]}>
          </Typography>
        </View>
      </View>
      <View style={{ marginTop: 32 }}>
        <Typography variant="headlineLarge" style={[styles.welcomeWhite, { color: semanticColors.onBackground }]}>
          Bem vindo <Typography variant="headlineLarge" style={[styles.welcomeOrange, { color: semanticColors.primary }]}>ao</Typography>
        </Typography>
        <Typography variant="headlineLarge" style={[styles.welcomeOrange, { color: semanticColors.primary }]}>
          Conexão Saudavel
        </Typography>
      </View>
      <View style={{ marginTop: 32 }}>
        <InputField
          name="email"
          control={control}
          label="E-mail"
          left={<IconButton icon="email-outline" size={20} iconColor={semanticColors.primary} style={{ marginTop: 8, marginLeft: 0, marginRight: -8 }} />}
        />
        <InputField
          name="password"
          control={control}
          label="Senha"
          secureTextEntry={!showPassword}
          left={<IconButton icon="lock-outline" size={20} iconColor={semanticColors.primary} style={{ marginTop: 8, marginLeft: 0, marginRight: -8 }} />}
          right={
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <IconButton icon={showPassword ? 'eye' : 'eye-off'} size={20} iconColor={semanticColors.primary} style={{ marginTop: 8, marginRight: -8 }} />
            </TouchableOpacity>
          }
        />
        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <Checkbox.Android
              status={remember ? 'checked' : 'unchecked'}
              onPress={() => setRemember((v) => !v)}
              color={semanticColors.primary}
              uncheckedColor={semanticColors.onSurface}
            />
            <Typography variant="bodySmall" style={[styles.checkboxLabel, { color: semanticColors.onSurface }]}>Lembre-se</Typography>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Typography variant="bodySmall" style={[styles.forgotText, { color: semanticColors.textSecondary }]}>Esqueceu sua senha?</Typography>
          </TouchableOpacity>
        </View>
        <Button
          title="ENTRAR"
          onPress={handleSubmit(onSubmit)}
          style={[styles.solidButton, { backgroundColor: semanticColors.primary }]}
          labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
          contentStyle={{ height: 48 }}
        />
      </View>
      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
        <Typography variant="labelSmall" style={[styles.dividerText, { color: semanticColors.textSecondary }]}>OU FAÇA LOGIN COM</Typography>
        <View style={[styles.divider, { backgroundColor: semanticColors.outline }]} />
      </View>
      <View style={styles.socialRow}>
        <IconButton icon="phone" size={24} iconColor={semanticColors.onSurface} style={[styles.socialButton, { backgroundColor: semanticColors.surfaceVariant }]} />
        <IconButton icon="email-outline" size={24} iconColor={semanticColors.onSurface} style={[styles.socialButton, { backgroundColor: semanticColors.surfaceVariant }]} />
        <IconButton icon="at" size={24} iconColor={semanticColors.onSurface} style={[styles.socialButton, { backgroundColor: semanticColors.surfaceVariant }]} />
      </View>
      <View style={styles.footerRow}>
        <Typography variant="labelSmall" style={[styles.footerText, { color: semanticColors.textSecondary }]}>NÃO TINHA UMA CONTA?</Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
          <Typography variant="labelSmall" style={[styles.registerText, { color: semanticColors.success }]}>CADASTRE-SE</Typography>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoImg: {
    width: 200,
    height: 200,
    marginRight: 8,
    alignSelf: 'center',
  },
  logoText: {
    color: '#FFB37B',
    marginLeft: 0,
    fontWeight: 'bold',
  },
  welcomeWhite: {
    color: '#fff',
    fontWeight: 'bold',
  },
  welcomeOrange: {
    color: '#FFB37B',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#fff',
    marginLeft: 2,
  },
  forgotText: {
    color: '#aaa',
    textDecorationLine: 'underline',
  },
  solidButton: {
    backgroundColor: '#FFB37B',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#aaa',
    marginHorizontal: 8,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32,
    marginBottom: 24,
  },
  socialButton: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#aaa',
    marginRight: 4,
  },
  registerText: {
    color: '#A3FF7A',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 