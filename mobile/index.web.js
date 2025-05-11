// c:\Users\maced\Documents\Faculdade\2025.1\Machine Learning\Projetos\Conexão Saudavel\app-repo\mobile\index.web.js
import { AppRegistry } from 'react-native';
import App from './src/App'; // Caminho confirmado para App.tsx

const appName = 'ConexaoSaudavelMobile'; // Nome definido para a aplicação web

// Registra o componente principal do aplicativo
AppRegistry.registerComponent(appName, () => App);

// Prepara o elemento raiz no HTML e monta o aplicativo
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'), // O ID do elemento div no seu HTML
});