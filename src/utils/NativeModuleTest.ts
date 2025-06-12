import { NativeModules, Platform } from 'react-native';

const { UsageStatsModule, AppUsageModule } = NativeModules;

export const testNativeModules = () => {
  console.log('=== TESTE DE MÓDULOS NATIVOS ===');
  console.log('Plataforma:', Platform.OS);
  console.log('UsageStatsModule disponível:', !!UsageStatsModule);
  console.log('AppUsageModule disponível:', !!AppUsageModule);
  
  if (UsageStatsModule) {
    console.log('Métodos do UsageStatsModule:', Object.keys(UsageStatsModule));
  }
  
  if (AppUsageModule) {
    console.log('Métodos do AppUsageModule:', Object.keys(AppUsageModule));
  }
  
  if (!UsageStatsModule && !AppUsageModule) {
    console.log('ERRO: Nenhum módulo nativo disponível!');
    console.log('Isso pode indicar que:');
    console.log('1. O módulo nativo não foi compilado corretamente');
    console.log('2. O módulo não está sendo importado corretamente');
    console.log('3. Há um problema na configuração do projeto');
  }
  
  console.log('=== FIM DO TESTE ===');
};

export const testUsageStats = async () => {
  if (Platform.OS !== 'android') {
    console.log('Teste só disponível no Android');
    return;
  }
  
  try {
    if (UsageStatsModule && UsageStatsModule.getUsageStats) {
      console.log('Testando UsageStatsModule.getUsageStats...');
      const endTime = Date.now();
      const startTime = endTime - (24 * 60 * 60 * 1000);
      const result = await UsageStatsModule.getUsageStats(startTime, endTime);
      console.log('Resultado do UsageStatsModule:', result);
    }
    
    if (AppUsageModule && AppUsageModule.getUsageStats) {
      console.log('Testando AppUsageModule.getUsageStats...');
      const result = await AppUsageModule.getUsageStats();
      console.log('Resultado do AppUsageModule:', result);
    }
  } catch (error) {
    console.error('Erro ao testar módulos:', error);
  }
}; 