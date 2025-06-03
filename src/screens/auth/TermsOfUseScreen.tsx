import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';

const TermsOfUseScreen = () => {
  return (
    <ScreenWrapper scrollable style={{ backgroundColor: semanticColors.background }}>
      <Typography variant="bodyMedium" style={styles.text}>
        {`Bem-vindo ao Conexão Saudável!\n\nAo criar uma conta e utilizar nosso aplicativo, você concorda com os seguintes termos de uso:\n\n1. O Conexão Saudável é destinado ao acompanhamento e à promoção de hábitos digitais mais saudáveis entre estudantes universitários.\n2. O aplicativo permite o registro e acompanhamento do tempo de uso do dispositivo, fornecendo relatórios e dicas para ajudar na redução da dependência digital.\n3. Os dados coletados podem ser armazenados localmente no seu dispositivo e, quando possível, sincronizados com um servidor remoto da instituição de ensino para fins de acompanhamento institucional.\n4. O uso do aplicativo é restrito a fins educativos e de autocuidado, sendo proibido qualquer uso para atividades ilícitas ou prejudiciais.\n5. O conteúdo do app é informativo e não substitui orientações de profissionais de saúde.\n6. Estes termos podem ser atualizados periodicamente. O uso contínuo do app implica concordância com as alterações.\n\nEm caso de dúvidas, entre em contato com o suporte da sua instituição.\n\nÚltima atualização: 2025.`}
      </Typography>
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

export default TermsOfUseScreen; 