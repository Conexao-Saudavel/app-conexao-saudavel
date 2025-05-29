import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';

const PrivacyPolicyScreen = () => {
  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background }}>
      <ScrollView style={styles.content}>
        <Typography variant="bodyMedium" style={styles.text}>
          {`Sua privacidade é muito importante para nós!\n\n- O Conexão Saudável coleta apenas as informações necessárias para monitorar e promover o uso consciente de dispositivos digitais.\n- Os dados de uso podem ser armazenados localmente no seu dispositivo e, quando houver conexão, sincronizados com o servidor da instituição responsável pelo acompanhamento.\n- Suas informações são utilizadas exclusivamente para fins de acompanhamento, geração de relatórios e apoio institucional, não sendo compartilhadas com terceiros sem seu consentimento.\n- Você pode solicitar a exclusão dos seus dados a qualquer momento, conforme as diretrizes da sua instituição.\n- Adotamos medidas de segurança para proteger seus dados contra acessos não autorizados.\n\nAo utilizar o app, você concorda com esta política de privacidade.\n\nPara mais informações ou dúvidas, entre em contato com o suporte da sua instituição.\n\nÚltima atualização: 2025.`}
        </Typography>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 24,
  },
  text: {
    color: semanticColors.textPrimary,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen; 