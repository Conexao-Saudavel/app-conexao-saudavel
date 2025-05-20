// c:\Users\maced\Documents\Faculdade\2025.1\Machine Learning\Projetos\Conexão Saudavel\app-repo\mobile\webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = __dirname; // O diretório do projeto mobile (onde este webpack.config.js está)
const appSrcDirectory = path.resolve(appDirectory, 'src');
const appBuildDirectory = path.resolve(appDirectory, 'dist/web'); // Pasta de saída para o build web
const publicPath = '/';

// Módulos nativos para mockar
const nativeModuleMocks = {
  'react-native-sqlite-storage': path.resolve(appSrcDirectory, 'mocks/emptyModule.js'),
  'react-native-background-fetch': path.resolve(appSrcDirectory, 'mocks/emptyModule.js'),
  'react-native-device-info': path.resolve(appSrcDirectory, 'mocks/emptyModule.js'),
  // Adicione outros módulos nativos aqui se necessário
  // Para @react-native-community/netinfo, react-native-web pode ter alguma cobertura,
  // mas se você encontrar problemas ou não precisar da funcionalidade na web, pode mockar também:
  // '@react-native-community/netinfo': path.resolve(appSrcDirectory, 'mocks/emptyModule.js'),
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(appDirectory, 'index.web.js'), // Ponto de entrada para a web
    output: {
      path: appBuildDirectory,
      publicPath: publicPath,
      filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      chunkFilename: isProduction ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    resolve: {
      // Prioriza extensões .web.* para permitir overrides específicos para web
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.tsx',
        '.ts',
        '.web.jsx',
        '.web.js',
        '.jsx',
        '.js',
        '.json',
      ],
      alias: {
        'react-native$': 'react-native-web', // Resolve 'react-native' para 'react-native-web'
        ...nativeModuleMocks, // Aplica os mocks para módulos nativos
        // Mock genérico para todo o pacote @expo/vector-icons
        '@expo/vector-icons': path.resolve(appSrcDirectory, 'mocks/emptyModule.js'),
        // Comentado pois o mock genérico acima deve cobrir, e emptyModule agora exporta um componente.
        // '@expo/vector-icons/MaterialCommunityIcons$': 'react-native-vector-icons/MaterialCommunityIcons',
        '@react-native-vector-icons/material-design-icons': path.resolve(appSrcDirectory, 'mocks/emptyModule.js'), // Mock para material-design-icons
        // Se você tiver aliases no tsconfig.json/jsconfig.json, precisa replicá-los aqui
        // Exemplo para o seu alias '@/*': ['src/*'] no tsconfig
        '@': appSrcDirectory,
      },
    },
    module: {
      rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        // Regra para o SEU CÓDIGO FONTE (src/ e index.web.js)
        {
          test: /\.(tsx?|jsx?)$/,
          include: [
            appSrcDirectory,
            path.resolve(appDirectory, 'index.web.js'),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',    // Para JavaScript moderno
                '@babel/preset-react',   // Para JSX (com runtime automático por padrão)
                '@babel/preset-typescript', // Para TypeScript
              ],
              plugins: [
                [
                  'module-resolver',
                  {
                    root: ['./src'],
                    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx', '.json'],
                    alias: { '@': './src' },
                  },
                ],
                'react-native-web',
              ].filter(Boolean),
            },
          },
        },
        // Regra para MÓDULOS EM NODE_MODULES que precisam de transpilação
        {
          test: /\.(tsx?|jsx?)$/,
          include: [
            path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
            path.resolve(appDirectory, 'node_modules/react-native-paper'),
            path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
            path.resolve(appDirectory, 'node_modules/@react-navigation'),
            // Adicione outros pacotes aqui se necessário
          ],
          use: {
            loader: 'babel-loader',
            options: {
              configFile: false, // Ignora babel.config.js para estes módulos de node_modules
              babelrc: false,    // Ignora .babelrc para estes módulos de node_modules
              presets: [
                '@babel/preset-env',    // Para JavaScript moderno
                '@babel/preset-react',   // Para JSX
                '@babel/preset-typescript', // Para TypeScript
              ],
              plugins: [
                'react-native-web',
                'react-native-reanimated/plugin',
              ].filter(Boolean),
              cacheDirectory: true,
            },
          },
        },
        // Regra para imagens
        {
          test: /\.(gif|jpe?g|png|svg|bmp|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext][query]',
          },
        },
        // Regra para fontes
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash][ext][query]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(appDirectory, 'index.web.html'), // Seu template HTML
        filename: 'index.html',
      }),
      // Define variáveis de ambiente globais (se necessário)
      // new webpack.DefinePlugin({
      //   __DEV__: !isProduction,
      // }),
      // Outros plugins do Webpack se necessário
    ].filter(Boolean),
    devServer: {
  static: {
    directory: appBuildDirectory,
  },
  compress: true,
  port: 8080,
  hot: true,
  historyApiFallback: true,
  host: '0.0.0.0', // IMPORTANTE: Permite acesso externo
  allowedHosts: 'all', // Permite todas as origens
  client: {
    webSocketURL: {
      hostname: '0.0.0.0',
    },
  },
},
    // Otimizações (mais relevantes para produção)
    optimization: {
      minimize: isProduction,
      // splitChunks: {
      //   chunks: 'all',
      // },
    },
  };
};