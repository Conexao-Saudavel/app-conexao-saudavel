import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';

const helpTopics = [
  {
    title: 'Diário Reflexivo',
    content: 'Registre diariamente suas reflexões sobre o uso do celular. Acesse o histórico para acompanhar seu progresso e editar ou excluir registros anteriores.'
  },
  {
    title: 'Metas de Uso',
    content: 'Defina limites diários para o uso de aplicativos. Você pode adicionar apps manualmente, editar metas individuais e acompanhar seu desempenho.'
  },
  {
    title: 'Gráficos de Uso',
    content: 'Visualize seu tempo de uso ao longo do tempo em gráficos intuitivos. Compare dias, semanas e identifique padrões de comportamento.'
  },
  {
    title: 'Privacidade',
    content: 'Seus dados de uso e reflexões são armazenados localmente e protegidos. O app solicita permissões apenas para monitorar o tempo de tela.'
  },
  {
    title: 'Cadastro e Login',
    content: 'Crie sua conta para salvar seu progresso. Caso esqueça a senha, utilize a opção de recuperação na tela de login.'
  },
  {
    title: 'Contato e Suporte',
    content: 'Em caso de dúvidas ou problemas, acesse as configurações para encontrar canais de contato ou envie um e-mail para suporte@conexaosaudavel.com.br'
  },
];

const HelpScreen: React.FC = () => {
  return (
    <ScreenWrapper scrollable>
      <Typography variant="headlineMedium" style={styles.title}>
        Ajuda
      </Typography>
      <View style={styles.topicsContainer}>
        {helpTopics.map((topic, idx) => (
          <View key={topic.title} style={styles.topicBox}>
            <Typography variant="titleMedium" style={styles.topicTitle}>{topic.title}</Typography>
            <Typography variant="bodyMedium" style={styles.topicContent}>{topic.content}</Typography>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topicsContainer: {
    gap: 18,
  },
  topicBox: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 1,
  },
  topicTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  topicContent: {
    color: '#444',
  },
});

export default HelpScreen; 