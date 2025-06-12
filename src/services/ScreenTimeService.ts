import { Platform, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as IntentLauncher from 'expo-intent-launcher';
import DatabaseService from './DatabaseService';
import { NativeModules } from 'react-native';

// Tentar usar o módulo correto
const { UsageStatsModule, AppUsageModule } = NativeModules;

export interface AppUsage {
  id: string;
  packageName: string;
  appName: string;
  startTime: number;
  endTime: number;
  duration: number;
  category: string;
  foreground: boolean;
  metadata?: string;
  synced: boolean;
  syncId?: string;
  syncAttemptCount: number;
  lastSyncAttempt?: number;
  createdAt: number;
  isManualEntry?: boolean;
}

export interface DailySummary {
  date: string;
  totalUsage: number;
  appBreakdown: {
    [key: string]: {
      name: string;
      duration: number;
      category: string;
    };
  };
  goalCompletion: number;
  mostUsedApp: string;
  streakCount: number;
  calculatedAt: number;
  synced: boolean;
}

class ScreenTimeService {
  private static instance: ScreenTimeService;
  private isMonitoring: boolean = false;
  private appStateSubscription: any;
  private lastActiveTime: number = 0;
  private currentAppInfo: { packageName: string; appName: string } | null = null;
  private isInForeground: boolean = false;
  private hasWellbeingAccess: boolean = false;
  private databaseService: DatabaseService;

  private constructor() {
    this.databaseService = DatabaseService.getInstance();
  }

  public static getInstance(): ScreenTimeService {
    if (!ScreenTimeService.instance) {
      ScreenTimeService.instance = new ScreenTimeService();
    }
    return ScreenTimeService.instance;
  }

  // Método para verificar se os módulos nativos estão disponíveis
  public checkNativeModules(): void {
    console.log('=== VERIFICANDO MÓDULOS NATIVOS ===');
    
    try {
      // Verificar se NativeModules está disponível
      if (!NativeModules) {
        console.log('❌ NativeModules não está disponível');
        return;
      }
      
      console.log('NativeModules disponível:', !!NativeModules);
      console.log('Chaves disponíveis em NativeModules:', Object.keys(NativeModules));
      
      // Verificar UsageStatsModule
      if (UsageStatsModule) {
        console.log('✅ UsageStatsModule encontrado');
        console.log('Métodos do UsageStatsModule:', Object.keys(UsageStatsModule));
      } else {
        console.log('❌ UsageStatsModule não encontrado');
      }
      
      // Verificar AppUsageModule
      if (AppUsageModule) {
        console.log('✅ AppUsageModule encontrado');
        console.log('Métodos do AppUsageModule:', Object.keys(AppUsageModule));
      } else {
        console.log('❌ AppUsageModule não encontrado');
      }
      
      // Tentar acessar diretamente pelo nome
      const appUsageModule = (NativeModules as any)['AppUsageModule'];
      if (appUsageModule) {
        console.log('✅ AppUsageModule encontrado via nome direto');
        console.log('Métodos via nome direto:', Object.keys(appUsageModule));
      } else {
        console.log('❌ AppUsageModule não encontrado via nome direto');
      }
      
      // Listar todos os módulos para debug
      console.log('Todos os módulos nativos disponíveis:');
      Object.keys(NativeModules).forEach(key => {
        console.log(`  - ${key}: ${typeof (NativeModules as any)[key]}`);
      });
      
    } catch (error) {
      console.error('❌ Erro ao verificar módulos nativos:', error);
    }
    
    console.log('=== FIM DA VERIFICAÇÃO DE MÓDULOS ===');
  }

  // Método para verificar e solicitar permissões de forma mais robusta
  async ensureWellbeingAccess(): Promise<boolean> {
    try {
      console.log('Verificando acesso ao Digital Wellbeing...');
      
      // Primeiro, verificar se já temos acesso
      const hasAccess = await this.checkWellbeingAccess();
      if (hasAccess) {
        console.log('Acesso ao Digital Wellbeing já concedido');
        return true;
      }

      console.log('Acesso não concedido, solicitando permissão...');
      
      // Tentar solicitar permissão
      const granted = await this.requestWellbeingPermission();
      if (granted) {
        console.log('Permissão concedida com sucesso');
        return true;
      }

      // Se não conseguiu, tentar verificar novamente após um delay
      console.log('Aguardando confirmação de permissão...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const finalCheck = await this.checkWellbeingAccess();
      if (finalCheck) {
        console.log('Permissão confirmada após delay');
        return true;
      }

      console.log('Permissão não foi concedida');
      return false;
    } catch (error) {
      console.error('Erro ao garantir acesso ao Digital Wellbeing:', error);
      return false;
    }
  }

  // Método para testar coleta de dados de forma mais detalhada
  public async testDataCollection(): Promise<void> {
    console.log('=== TESTE DETALHADO DE COLETA DE DADOS ===');
    
    try {
      // 1. Verificar módulos nativos
      this.checkNativeModules();
      
      // 2. Verificar permissões
      const hasAccess = await this.ensureWellbeingAccess();
      console.log('Resultado da verificação de permissões:', hasAccess);
      
      // 3. Tentar coletar dados
      if (hasAccess) {
        console.log('Tentando coletar dados do Digital Wellbeing...');
        await this.collectWellbeingData();
        
        // 4. Verificar se dados foram salvos
        const today = new Date().toISOString().split('T')[0];
        const savedData = await this.getAppUsageHistory(today, today);
        console.log('Dados salvos hoje:', savedData.length);
        
        if (savedData.length === 0) {
          console.log('Nenhum dado foi coletado do Digital Wellbeing.');
          console.log('Use o botão "Gerar Dados de Exemplo" se quiser dados para teste.');
        } else {
          console.log('Dados coletados com sucesso do Digital Wellbeing!');
        }
      } else {
        console.log('Sem permissão para acessar Digital Wellbeing.');
        console.log('Use o botão "Solicitar Permissões" para tentar obter acesso.');
      }
      
      console.log('=== FIM DO TESTE ===');
    } catch (error) {
      console.error('Erro no teste de coleta:', error);
    }
  }

  // Método público para testar coleta de dados filtrada
  public async testFilteredDataCollection(): Promise<void> {
    console.log('=== TESTE DE COLETA DE DADOS FILTRADA ===');
    
    try {
      // 1. Verificar permissões
      const hasAccess = await this.checkWellbeingAccess();
      if (!hasAccess) {
        console.log('Sem permissão para acessar Digital Wellbeing.');
        return;
      }

      // 2. Coletar dados
      console.log('Coletando dados filtrados...');
      await this.collectWellbeingData();
      
      // 3. Verificar dados salvos
      const today = new Date().toISOString().split('T')[0];
      const savedData = await this.getAppUsageHistory(today, today);
      
      console.log(`Dados filtrados salvos: ${savedData.length} registros`);
      
      // 4. Mostrar resumo
      if (savedData.length > 0) {
        const topApps = savedData
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 5);
        
        console.log('Top 5 apps por tempo de uso:');
        topApps.forEach((app, index) => {
          const hours = Math.floor(app.duration / 3600);
          const minutes = Math.floor((app.duration % 3600) / 60);
          console.log(`${index + 1}. ${app.appName}: ${hours}h ${minutes}m (${app.duration}s)`);
        });
      }
      
      console.log('=== FIM DO TESTE FILTRADO ===');
    } catch (error) {
      console.error('Erro no teste de coleta filtrada:', error);
    }
  }

  private async collectWellbeingData(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      console.log('Iniciando coleta de dados do Digital Wellbeing...');
      
      // Verificar se temos acesso ao Digital Wellbeing
      const hasAccess = await this.checkWellbeingAccess();
      if (!hasAccess) {
        console.log('Acesso ao Digital Wellbeing não concedido');
        return;
      }

      console.log('Acesso ao Digital Wellbeing concedido, coletando dados...');

      // Coletar dados de uso das últimas 24 horas
      const endTime = Date.now();
      const startTime = endTime - (24 * 60 * 60 * 1000); // 24 horas atrás

      // Tentar usar o módulo correto de forma robusta
      let usageStats = null;
      let appUsageModule = null;
      
      // Tentar diferentes formas de acessar o módulo
      if (AppUsageModule) {
        appUsageModule = AppUsageModule;
        console.log('Usando AppUsageModule via import direto...');
      } else if ((NativeModules as any)['AppUsageModule']) {
        appUsageModule = (NativeModules as any)['AppUsageModule'];
        console.log('Usando AppUsageModule via NativeModules...');
      }
      
      if (appUsageModule && appUsageModule.getUsageStats) {
        try {
          console.log('Chamando getUsageStats do AppUsageModule...');
          usageStats = await appUsageModule.getUsageStats();
          console.log('Dados coletados via AppUsageModule:', usageStats);
        } catch (error) {
          console.log('Erro ao coletar dados via AppUsageModule:', error);
        }
      } else if (UsageStatsModule && UsageStatsModule.getUsageStats) {
        try {
          console.log('Usando UsageStatsModule...');
          usageStats = await UsageStatsModule.getUsageStats(startTime, endTime);
          console.log('Dados coletados via UsageStatsModule:', usageStats);
        } catch (error) {
          console.log('Erro ao coletar dados via UsageStatsModule:', error);
        }
      } else {
        console.log('Nenhum módulo de uso disponível');
        return;
      }
      
      if (usageStats && Array.isArray(usageStats)) {
        console.log(`Processando ${usageStats.length} apps...`);
        for (const stat of usageStats) {
          const appUsage: Omit<AppUsage, 'id' | 'synced' | 'syncAttemptCount' | 'createdAt'> = {
            packageName: stat.packageName,
            appName: stat.appName || await this.getAppName(stat.packageName),
            startTime: stat.firstTimeStamp || stat.lastTimeUsed,
            endTime: stat.lastTimeStamp || Date.now(),
            duration: stat.totalTimeInForeground || stat.duration || 0,
            category: this.getAppCategory(stat.packageName),
            foreground: true,
          };

          await this.recordAppUsage(appUsage);
        }
      } else if (usageStats && usageStats.apps) {
        console.log(`Processando ${usageStats.apps.length} apps do AppUsageModule...`);
        for (const stat of usageStats.apps) {
          // Os dados estão em milissegundos, não precisamos converter
          const durationInMs = stat.totalTimeInForeground;
          const durationInSeconds = Math.floor(durationInMs / 1000);
          
          console.log(`App: ${stat.appName}, Tempo: ${Math.floor(durationInMs / (1000 * 60 * 60))}h ${Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60))}m (${durationInMs}ms)`);
          
          const appUsage: Omit<AppUsage, 'id' | 'synced' | 'syncAttemptCount' | 'createdAt'> = {
            packageName: stat.packageName,
            appName: stat.appName,
            startTime: stat.lastTimeUsed - durationInMs, // Calcular start time baseado na duração
            endTime: stat.lastTimeUsed,
            duration: durationInSeconds, // Converter para segundos para compatibilidade
            category: this.getAppCategory(stat.packageName),
            foreground: true,
          };

          await this.recordAppUsage(appUsage);
        }
      } else {
        console.log('Formato de dados não reconhecido:', usageStats);
      }
    } catch (error) {
      console.error('Erro ao coletar dados do Digital Wellbeing:', error);
    }
  }

  private async getAppName(packageName: string): Promise<string> {
    try {
      let appInfo;
      if (UsageStatsModule && UsageStatsModule.getAppInfo) {
        appInfo = await UsageStatsModule.getAppInfo(packageName);
      } else if (AppUsageModule && AppUsageModule.getAppInfo) {
        appInfo = await AppUsageModule.getAppInfo(packageName);
      }
      return appInfo?.label || packageName;
    } catch (error) {
      console.error('Erro ao obter nome do app:', error);
      return packageName;
    }
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    try {
      console.log('Iniciando monitoramento...');
      
      if (Platform.OS === 'android') {
        // Verificar acesso ao Digital Wellbeing de forma rigorosa
        try {
          const hasAccess = await this.checkWellbeingAccess();
          if (hasAccess) {
            console.log('Acesso ao Digital Wellbeing confirmado, coletando dados...');
            await this.collectWellbeingData();
          } else {
            console.log('Acesso ao Digital Wellbeing não concedido - monitoramento manual ativo');
            console.log('Use o botão "Solicitar Permissões" para tentar obter acesso ao Digital Wellbeing');
          }
        } catch (error) {
          console.log('Erro ao verificar acesso ao Digital Wellbeing - monitoramento manual ativo:', error);
        }
      }

      this.isMonitoring = true;
      this.setupAppStateListener();
      this.startTracking();
      console.log('Monitoramento iniciado com sucesso');
    } catch (error) {
      console.error('Erro ao iniciar monitoramento:', error);
      // Não lançar erro para evitar crash, apenas logar
      this.isMonitoring = false;
    }
  }

  async checkWellbeingAccess(): Promise<boolean> {
    try {
      console.log('=== VERIFICANDO ACESSO AO DIGITAL WELLBEING ===');
      
      // Primeiro, verificar se temos acesso ao módulo nativo
      if (Platform.OS !== 'android') {
        console.log('Plataforma não suportada para Digital Wellbeing');
        return false;
      }

      // Tentar verificar permissão diretamente com o módulo nativo
      let hasNativeAccess = false;
      
      // Tentar diferentes formas de acessar o módulo
      let appUsageModule = null;
      
      // Forma 1: Acesso direto
      if (AppUsageModule) {
        appUsageModule = AppUsageModule;
        console.log('✅ AppUsageModule encontrado via import direto');
      }
      // Forma 2: Acesso via NativeModules
      else if ((NativeModules as any)['AppUsageModule']) {
        appUsageModule = (NativeModules as any)['AppUsageModule'];
        console.log('✅ AppUsageModule encontrado via NativeModules');
      }
      // Forma 3: Acesso via nome
      else {
        console.log('❌ AppUsageModule não encontrado de nenhuma forma');
      }
      
      // Tentar verificar permissão se o módulo foi encontrado
      if (appUsageModule && appUsageModule.checkUsagePermission) {
        try {
          hasNativeAccess = await appUsageModule.checkUsagePermission();
          console.log('Verificação nativa de permissão (AppUsageModule):', hasNativeAccess);
        } catch (error) {
          console.log('Erro na verificação nativa (AppUsageModule):', error);
        }
      } else if (UsageStatsModule && UsageStatsModule.checkUsagePermission) {
        try {
          hasNativeAccess = await UsageStatsModule.checkUsagePermission();
          console.log('Verificação nativa de permissão (UsageStatsModule):', hasNativeAccess);
        } catch (error) {
          console.log('Erro na verificação nativa (UsageStatsModule):', error);
        }
      } else {
        console.log('Nenhum módulo nativo disponível para verificação de permissão');
      }

      // Verificar também no banco de dados
      const storedAccess = await this.databaseService.getSetting('has_wellbeing_access');
      const hasStoredAccess = storedAccess === 'true';
      
      console.log('Permissão armazenada no banco:', hasStoredAccess);
      
      // Lógica mais rigorosa: só considerar acesso se a verificação nativa for positiva
      // O valor armazenado no banco é apenas para referência, não para decisão
      if (hasNativeAccess) {
        console.log('✓ Acesso nativo confirmado - permissão concedida');
        if (!hasStoredAccess) {
          await this.setWellbeingAccess(true);
        }
        this.hasWellbeingAccess = true;
        return true;
      } else {
        console.log('✗ Acesso nativo negado - permissão não concedida');
        // Se não tem acesso nativo, mas está marcado como true no banco, corrigir
        if (hasStoredAccess) {
          console.log('Corrigindo permissão no banco (marcada incorretamente)');
          await this.setWellbeingAccess(false);
        }
        this.hasWellbeingAccess = false;
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar acesso ao Digital Wellbeing:', error);
      // Se não conseguir verificar, assumir que não tem acesso
      this.hasWellbeingAccess = false;
      return false;
    }
  }

  async setWellbeingAccess(hasAccess: boolean): Promise<void> {
    try {
      this.hasWellbeingAccess = hasAccess;
      await this.databaseService.setSetting('has_wellbeing_access', hasAccess.toString());
    } catch (error) {
      console.error('Erro ao definir acesso ao Digital Wellbeing:', error);
    }
  }

  stopMonitoring(): void {
    try {
      if (this.appStateSubscription) {
        this.appStateSubscription.remove();
        this.appStateSubscription = null;
      }
      this.isMonitoring = false;
    } catch (error) {
      console.error('Erro ao parar monitoramento:', error);
    }
  }

  private setupAppStateListener(): void {
    try {
      this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    } catch (error) {
      console.error('Erro ao configurar listener de estado do app:', error);
    }
  }

  private handleAppStateChange = async (nextAppState: string) => {
    try {
      if (nextAppState === 'active') {
        this.isInForeground = true;
        this.lastActiveTime = Date.now();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        this.isInForeground = false;
      }
    } catch (error) {
      console.error('Erro ao lidar com mudança de estado do app:', error);
    }
  };

  private getAppCategory(packageName: string): string {
    try {
      const categoryMap: { [key: string]: string } = {
        // Redes Sociais
        'com.instagram.android': 'social',
        'com.instagram.barcelona': 'social', // Threads
        'com.facebook.katana': 'social',
        'com.facebook.orca': 'social', // Messenger
        'com.whatsapp': 'social',
        'com.twitter.android': 'social',
        'com.snapchat.android': 'social',
        'com.linkedin.android': 'social',
        'com.pinterest': 'social',
        'com.reddit.frontpage': 'social',
        'com.discord': 'social',
        'com.telegram.messenger': 'social',
        'com.skype.raider': 'social',
        'com.viber.voip': 'social',
        'com.tinder': 'social',
        'com.badoo.mobile': 'social',
        'com.ftw_and_co.happn': 'social',
        'com.uapp': 'social', // Umatch
        
        // Entretenimento
        'com.google.android.youtube': 'entertainment',
        'com.zhiliaoapp.musically': 'entertainment', // TikTok
        'com.spotify.music': 'entertainment',
        'com.netflix.mediaclient': 'entertainment',
        'com.android.chrome': 'entertainment',
        
        // Utilitários
        'com.google.android.apps.maps': 'utility',
        'com.google.android.gm': 'utility', // Gmail
        'br.com.timbrasil.meutim': 'utility', // Meu TIM
        
        // Padrão
        'default': 'other',
      };
      return categoryMap[packageName] || 'other';
    } catch (error) {
      console.error('Erro ao obter categoria do app:', error);
      return 'other';
    }
  }

  private async startTracking(): Promise<void> {
    try {
      this.lastActiveTime = Date.now();
    } catch (error) {
      console.error('Erro ao iniciar tracking:', error);
    }
  }

  // Método para o usuário registrar manualmente o uso de apps
  async recordManualAppUsage(appName: string, duration: number, category: string = 'other'): Promise<void> {
    try {
      const now = Date.now();
      await this.recordAppUsage({
        packageName: `manual.${appName.toLowerCase().replace(/\s+/g, '')}`,
        appName,
        startTime: now - duration * 1000,
        endTime: now,
        duration,
        foreground: true,
        category,
        isManualEntry: true,
      });
    } catch (error) {
      console.error('Erro ao registrar uso manual do app:', error);
    }
  }

  async recordAppUsage(usage: Omit<AppUsage, 'id' | 'synced' | 'syncAttemptCount' | 'createdAt'>): Promise<void> {
    try {
      const appUsage: AppUsage = {
        ...usage,
        id: Math.random().toString(36).substr(2, 9),
        synced: false,
        syncAttemptCount: 0,
        createdAt: Date.now(),
      };

      await this.databaseService.saveAppUsage(appUsage);
      await this.updateDailySummary(appUsage);
    } catch (error) {
      console.error('Erro ao registrar uso do app:', error);
      // Não lançar erro para evitar crash
    }
  }

  private async updateDailySummary(appUsage: AppUsage): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const summary = await this.databaseService.getDailySummary(today) || {
        date: today,
        totalUsage: 0,
        appBreakdown: {},
        goalCompletion: 0,
        mostUsedApp: '',
        streakCount: 0,
        calculatedAt: Date.now(),
        synced: false,
      };

      // Atualizar breakdown do app
      if (!summary.appBreakdown[appUsage.packageName]) {
        summary.appBreakdown[appUsage.packageName] = {
          name: appUsage.appName,
          duration: 0,
          category: appUsage.category,
        };
      }
      summary.appBreakdown[appUsage.packageName].duration += appUsage.duration;

      // Atualizar uso total
      summary.totalUsage += appUsage.duration;

      // Encontrar app mais usado
      let maxDuration = 0;
      for (const [packageName, data] of Object.entries(summary.appBreakdown)) {
        if (data.duration > maxDuration) {
          maxDuration = data.duration;
          summary.mostUsedApp = data.name;
        }
      }

      // Calcular percentual de meta (exemplo: meta de 4 horas = 14400 segundos)
      const dailyGoal = 14400; // 4 horas em segundos
      summary.goalCompletion = Math.min((summary.totalUsage / dailyGoal) * 100, 100);

      await this.databaseService.saveDailySummary(summary);
    } catch (error) {
      console.error('Erro ao atualizar resumo diário:', error);
    }
  }

  async getAppUsageHistory(startDate: string, endDate: string): Promise<AppUsage[]> {
    try {
      const history = await this.databaseService.getAppUsageHistory(startDate, endDate);
      return history || [];
    } catch (error) {
      console.error('Erro ao obter histórico de uso:', error);
      return [];
    }
  }

  async getDailySummary(date: string): Promise<DailySummary | null> {
    try {
      const summary = await this.databaseService.getDailySummary(date);
      return summary;
    } catch (error) {
      console.error('Erro ao obter resumo diário:', error);
      return null;
    }
  }

  // Método para gerar dados de teste baseados na meta do usuário
  async generateMockData(days: number): Promise<void> {
    try {
      console.log('Gerando dados mock baseados na meta do usuário...');
      
      // Obter a meta diária do usuário
      const dailyGoalHours = await this.databaseService.getSetting('daily_goal_hours');
      const dailyGoalMinutes = dailyGoalHours ? parseFloat(dailyGoalHours) * 60 : 240; // 4 horas padrão
      
      console.log(`Meta diária do usuário: ${dailyGoalMinutes} minutos (${dailyGoalMinutes/60} horas)`);
      
      const now = Date.now();
      const apps = [
        { name: 'Instagram', package: 'com.instagram.android', category: 'social', weight: 0.25 },
        { name: 'TikTok', package: 'com.tiktok.android', category: 'social', weight: 0.20 },
        { name: 'YouTube', package: 'com.google.android.youtube', category: 'entertainment', weight: 0.15 },
        { name: 'WhatsApp', package: 'com.whatsapp', category: 'social', weight: 0.15 },
        { name: 'Facebook', package: 'com.facebook.katana', category: 'social', weight: 0.10 },
        { name: 'Twitter', package: 'com.twitter.android', category: 'social', weight: 0.05 },
        { name: 'Spotify', package: 'com.spotify.music', category: 'entertainment', weight: 0.05 },
        { name: 'Netflix', package: 'com.netflix.mediaclient', category: 'entertainment', weight: 0.05 },
      ];

      // Gerar dados para cada dia
      for (let i = 0; i < days; i++) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        // Determinar o uso total do dia baseado na meta
        const dailyUsageVariation = this.getDailyUsageVariation(dailyGoalMinutes);
        const totalDailyUsage = Math.round(dailyGoalMinutes * dailyUsageVariation);
        
        console.log(`Dia ${dateStr}: ${totalDailyUsage} minutos (${totalDailyUsage/60} horas)`);

        // Distribuir o uso entre os apps baseado nos pesos
        let remainingUsage = totalDailyUsage;
        const appUsage = [];

        for (const app of apps) {
          if (remainingUsage <= 0) break;
          
          // Calcular uso para este app baseado no peso
          const appUsageMinutes = Math.round(totalDailyUsage * app.weight * (0.8 + Math.random() * 0.4)); // Variação de ±20%
          const actualUsage = Math.min(appUsageMinutes, remainingUsage);
          
          if (actualUsage > 0) {
            appUsage.push({
              app,
              duration: actualUsage
            });
            remainingUsage -= actualUsage;
          }
        }

        // Gerar sessões para cada app
        for (const { app, duration } of appUsage) {
          const sessions = this.generateSessionsForDay(duration, date);
          
          for (const session of sessions) {
            await this.recordAppUsage({
              packageName: app.package,
              appName: app.name,
              startTime: session.startTime,
              endTime: session.endTime,
              duration: session.duration,
              category: app.category,
              foreground: true,
            });
          }
        }
      }
      
      console.log('Dados mock gerados com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar dados mock:', error);
    }
  }

  // Método para gerar variação no uso diário (mais realista)
  private getDailyUsageVariation(baseMinutes: number): number {
    const dayOfWeek = new Date().getDay();
    
    // Padrões de uso por dia da semana
    const dayPatterns = {
      0: 0.8,  // Domingo - menos uso
      1: 1.1,  // Segunda - mais uso (início da semana)
      2: 1.0,  // Terça - uso normal
      3: 1.0,  // Quarta - uso normal
      4: 1.1,  // Quinta - mais uso
      5: 1.2,  // Sexta - mais uso (fim da semana)
      6: 0.9,  // Sábado - uso moderado
    };
    
    const dayMultiplier = dayPatterns[dayOfWeek as keyof typeof dayPatterns] || 1.0;
    
    // Adicionar variação aleatória (±15%)
    const randomVariation = 0.85 + Math.random() * 0.3;
    
    return dayMultiplier * randomVariation;
  }

  // Método para gerar sessões realistas para um dia
  private generateSessionsForDay(totalMinutes: number, date: Date): Array<{startTime: number, endTime: number, duration: number}> {
    const sessions = [];
    let remainingMinutes = totalMinutes;
    
    // Gerar entre 3-8 sessões por dia
    const numSessions = Math.floor(3 + Math.random() * 6);
    
    for (let i = 0; i < numSessions && remainingMinutes > 0; i++) {
      // Duração da sessão entre 5-45 minutos
      const sessionDuration = Math.min(
        Math.floor(5 + Math.random() * 40),
        remainingMinutes
      );
      
      if (sessionDuration <= 0) break;
      
      // Horário da sessão (evitar madrugada)
      const hour = 6 + Math.floor(Math.random() * 16); // Entre 6h e 22h
      const minute = Math.floor(Math.random() * 60);
      
      const sessionStart = new Date(date);
      sessionStart.setHours(hour, minute, 0, 0);
      
      const sessionEnd = new Date(sessionStart.getTime() + sessionDuration * 60 * 1000);
      
      sessions.push({
        startTime: sessionStart.getTime(),
        endTime: sessionEnd.getTime(),
        duration: sessionDuration
      });
      
      remainingMinutes -= sessionDuration;
    }
    
    return sessions;
  }

  // Método para solicitar permissões do Digital Wellbeing
  async requestWellbeingPermission(): Promise<boolean> {
    try {
      if (Platform.OS !== 'android') {
        console.log('Plataforma não suportada para Digital Wellbeing');
        return false;
      }

      console.log('Solicitando permissão do Digital Wellbeing...');

      // Tentar abrir configurações de uso
      let settingsOpened = false;
      
      if (UsageStatsModule && UsageStatsModule.openUsageAccessSettings) {
        try {
          await UsageStatsModule.openUsageAccessSettings();
          settingsOpened = true;
          console.log('Configurações abertas via UsageStatsModule');
        } catch (error) {
          console.log('Erro ao abrir configurações via UsageStatsModule:', error);
        }
      }
      
      if (!settingsOpened && AppUsageModule && AppUsageModule.openUsageAccessSettings) {
        try {
          await AppUsageModule.openUsageAccessSettings();
          settingsOpened = true;
          console.log('Configurações abertas via AppUsageModule');
        } catch (error) {
          console.log('Erro ao abrir configurações via AppUsageModule:', error);
        }
      }

      if (!settingsOpened) {
        console.log('Não foi possível abrir configurações automaticamente');
        console.log('Por favor, vá em Configurações > Digital Wellbeing > Acesso ao uso e ative para este app');
        return false;
      }

      // Aguardar e verificar se a permissão foi concedida
      console.log('Aguardando confirmação de permissão...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const hasAccess = await this.checkWellbeingAccess();
      if (hasAccess) {
        await this.setWellbeingAccess(true);
        console.log('Permissão do Digital Wellbeing concedida');
        return true;
      } else {
        console.log('Permissão do Digital Wellbeing não foi concedida');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão do Digital Wellbeing:', error);
      return false;
    }
  }
}

export default ScreenTimeService; 