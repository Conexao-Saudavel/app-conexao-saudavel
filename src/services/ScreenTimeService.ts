import { Platform, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as IntentLauncher from 'expo-intent-launcher';
import DatabaseService from './DatabaseService';

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

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    try {
      if (Platform.OS === 'android') {
        await this.checkWellbeingAccess();
      }

      this.isMonitoring = true;
      this.setupAppStateListener();
      this.startTracking();
    } catch (error) {
      console.error('Erro ao iniciar monitoramento:', error);
      throw error;
    }
  }

  async checkWellbeingAccess(): Promise<boolean> {
    try {
      const hasAccess = await this.databaseService.getSetting('has_wellbeing_access');
      this.hasWellbeingAccess = hasAccess === 'true';
      return this.hasWellbeingAccess;
    } catch (error) {
      console.error('Erro ao verificar acesso ao Digital Wellbeing:', error);
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
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    this.isMonitoring = false;
  }

  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'active') {
      this.isInForeground = true;
      this.lastActiveTime = Date.now();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.isInForeground = false;
    }
  };

  private getAppCategory(packageName: string): string {
    const categoryMap: { [key: string]: string } = {
      'com.instagram.android': 'social',
      'com.tiktok.android': 'social',
      'com.google.android.youtube': 'entertainment',
      'com.whatsapp': 'social',
      'com.facebook.katana': 'social',
      'com.twitter.android': 'social',
      'com.spotify.music': 'entertainment',
      'com.netflix.mediaclient': 'entertainment',
    };
    return categoryMap[packageName] || 'other';
  }

  private async startTracking(): Promise<void> {
    this.lastActiveTime = Date.now();
  }

  // Método para o usuário registrar manualmente o uso de apps
  async recordManualAppUsage(appName: string, duration: number, category: string = 'other'): Promise<void> {
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
  }

  async recordAppUsage(usage: Omit<AppUsage, 'id' | 'synced' | 'syncAttemptCount' | 'createdAt'>): Promise<void> {
    const appUsage: AppUsage = {
      ...usage,
      id: Math.random().toString(36).substr(2, 9),
      synced: false,
      syncAttemptCount: 0,
      createdAt: Date.now(),
    };

    try {
      await this.databaseService.saveAppUsage(appUsage);
      await this.updateDailySummary(appUsage);
    } catch (error) {
      console.error('Erro ao registrar uso do app:', error);
      throw error;
    }
  }

  private async updateDailySummary(appUsage: AppUsage): Promise<void> {
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
  }

  async getAppUsageHistory(startDate: string, endDate: string): Promise<AppUsage[]> {
    return this.databaseService.getAppUsageHistory(startDate, endDate);
  }

  async getDailySummary(date: string): Promise<DailySummary | null> {
    return this.databaseService.getDailySummary(date);
  }

  // Método para gerar dados de teste
  async generateMockData(days: number): Promise<void> {
    const now = Date.now();
    const apps = [
      { name: 'Instagram', package: 'com.instagram.android', category: 'social' },
      { name: 'TikTok', package: 'com.tiktok.android', category: 'social' },
      { name: 'YouTube', package: 'com.google.android.youtube', category: 'entertainment' },
      { name: 'WhatsApp', package: 'com.whatsapp', category: 'social' },
    ];

    for (let i = 0; i < days; i++) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      for (const app of apps) {
        const sessions = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < sessions; j++) {
          const duration = Math.floor(Math.random() * 30 * 60) + 300; // 5-35 minutos
          const startTime = date.getTime() + j * 2 * 60 * 60 * 1000; // 2 horas entre sessões

          await this.recordAppUsage({
            packageName: app.package,
            appName: app.name,
            startTime,
            endTime: startTime + duration * 1000,
            duration,
            category: app.category,
            foreground: true,
          });
        }
      }
    }
  }
}

export default ScreenTimeService; 