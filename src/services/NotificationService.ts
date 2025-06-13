import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import DatabaseService from './DatabaseService';
import ScreenTimeService from './ScreenTimeService';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  nearGoalThreshold: number; // Percentual para notificar quando próximo da meta
  exceededGoalEnabled: boolean;
  motivationalEnabled: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private databaseService: DatabaseService;
  private screenTimeService: ScreenTimeService;
  private isInitialized: boolean = false;

  private constructor() {
    this.databaseService = DatabaseService.getInstance();
    this.screenTimeService = ScreenTimeService.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Inicializar o serviço de notificações
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Inicializando serviço de notificações...');
      
      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissão de notificações não concedida');
        await this.databaseService.setSetting('notifications_enabled', 'false');
        return;
      }

      // Configurar token para push notifications (se necessário)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      await this.databaseService.setSetting('notifications_enabled', 'true');
      this.isInitialized = true;
      console.log('Serviço de notificações inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar serviço de notificações:', error);
      await this.databaseService.setSetting('notifications_enabled', 'false');
    }
  }

  // Verificar se as notificações estão habilitadas
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const settingEnabled = await this.databaseService.getSetting('notifications_enabled');
      return status === 'granted' && settingEnabled === 'true';
    } catch (error) {
      console.error('Erro ao verificar permissões de notificação:', error);
      return false;
    }
  }

  // Obter configurações de notificação
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const enabled = await this.areNotificationsEnabled();
      const nearGoalThreshold = await this.databaseService.getSetting('near_goal_threshold');
      const exceededGoalEnabled = await this.databaseService.getSetting('exceeded_goal_enabled');
      const motivationalEnabled = await this.databaseService.getSetting('motivational_enabled');

      return {
        enabled,
        nearGoalThreshold: nearGoalThreshold ? parseInt(nearGoalThreshold) : 80, // 80% padrão
        exceededGoalEnabled: exceededGoalEnabled === 'true',
        motivationalEnabled: motivationalEnabled === 'true'
      };
    } catch (error) {
      console.error('Erro ao obter configurações de notificação:', error);
      return {
        enabled: false,
        nearGoalThreshold: 80,
        exceededGoalEnabled: true,
        motivationalEnabled: true
      };
    }
  }

  // Salvar configurações de notificação
  async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    try {
      await this.databaseService.setSetting('notifications_enabled', settings.enabled.toString());
      await this.databaseService.setSetting('near_goal_threshold', settings.nearGoalThreshold.toString());
      await this.databaseService.setSetting('exceeded_goal_enabled', settings.exceededGoalEnabled.toString());
      await this.databaseService.setSetting('motivational_enabled', settings.motivationalEnabled.toString());
    } catch (error) {
      console.error('Erro ao salvar configurações de notificação:', error);
    }
  }

  // Verificar e enviar notificações baseadas no uso atual
  async checkAndSendUsageNotifications(): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.enabled) return;

      const today = new Date().toISOString().split('T')[0];
      const dailySummary = await this.screenTimeService.getDailySummary(today);
      if (!dailySummary) return;

      const goalHours = await this.databaseService.getSetting('daily_goal_hours');
      const goalSeconds = goalHours ? parseFloat(goalHours) * 3600 : 14400; // 4 horas padrão em segundos

      const usagePercentage = (dailySummary.totalUsage / goalSeconds) * 100;

      // Notificar quando próximo da meta
      if (usagePercentage >= settings.nearGoalThreshold && usagePercentage < 100) {
        await this.sendNearGoalNotification(usagePercentage, goalSeconds);
      }

      // Notificar quando meta excedida
      if (usagePercentage >= 100 && settings.exceededGoalEnabled) {
        await this.sendExceededGoalNotification(usagePercentage, goalSeconds);
      }
    } catch (error) {
      console.error('Erro ao verificar notificações de uso:', error);
    }
  }

  // Enviar notificação quando próximo da meta
  private async sendNearGoalNotification(usagePercentage: number, goalSeconds: number): Promise<void> {
    const messages = [
      `Você está a ${Math.round(100 - usagePercentage)}% da sua meta diária!`,
      `Cuidado! Você já usou ${Math.round(usagePercentage)}% do seu tempo diário.`,
      `Faltam apenas ${Math.round((goalSeconds * (100 - usagePercentage)) / 100 / 60)} minutos para sua meta!`,
      `Você está quase atingindo seu limite diário. Que tal uma pausa?`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Meta Próxima',
        body: randomMessage,
        data: { type: 'near_goal', usagePercentage },
      },
      trigger: null, // Enviar imediatamente
    });
  }

  // Enviar notificação quando meta excedida
  private async sendExceededGoalNotification(usagePercentage: number, goalSeconds: number): Promise<void> {
    const messages = [
      'Você excedeu sua meta diária! Que tal uma pausa para descansar?',
      'Meta diária excedida! É hora de desconectar um pouco.',
      'Você passou do seu limite diário. Considere fazer outras atividades.',
      'Tempo de tela excedido! Que tal ler um livro ou sair para caminhar?'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚫 Meta Excedida',
        body: randomMessage,
        data: { type: 'exceeded_goal', usagePercentage },
      },
      trigger: null, // Enviar imediatamente
    });
  }

  // Enviar notificação motivacional
  async sendMotivationalNotification(): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.enabled || !settings.motivationalEnabled) return;

      const messages = [
        'Você está fazendo um ótimo trabalho controlando seu tempo de tela!',
        'Cada dia é uma nova oportunidade para melhorar seus hábitos!',
        'Continue firme! Seu bem-estar digital está melhorando!',
        'Parabéns por cuidar do seu tempo! Você está no caminho certo!',
        'Lembre-se: qualidade é melhor que quantidade no uso do celular!'
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Motivacional',
          body: randomMessage,
          data: { type: 'motivational' },
        },
        trigger: null, // Enviar imediatamente
      });
    } catch (error) {
      console.error('Erro ao enviar notificação motivacional:', error);
    }
  }

  // Enviar notificação de streak (dias consecutivos)
  async sendStreakNotification(streakDays: number): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.enabled || !settings.motivationalEnabled) return;

      let title: string;
      let message: string;

      if (streakDays === 1) {
        title = '🎉 Primeiro Dia!';
        message = 'Parabéns! Você completou seu primeiro dia seguindo sua meta!';
      } else if (streakDays === 7) {
        title = '🔥 Uma Semana!';
        message = 'Incrível! Você manteve sua meta por uma semana inteira!';
      } else if (streakDays === 30) {
        title = '🏆 Um Mês!';
        message = 'Fantástico! Você é um exemplo de consistência!';
      } else if (streakDays % 7 === 0) {
        title = '🔥 Streak Ativo!';
        message = `Parabéns! Você mantém sua meta há ${streakDays} dias!`;
      } else {
        return; // Não enviar para outros dias
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { type: 'streak', streakDays },
        },
        trigger: null, // Enviar imediatamente
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de streak:', error);
    }
  }

  // Cancelar todas as notificações agendadas
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  }

  // Testar notificação (útil para debug)
  async testNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Teste de Notificação',
          body: 'Esta é uma notificação de teste do Conexão Saudável!',
          data: { type: 'test' },
        },
        trigger: null, // Enviar imediatamente
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
    }
  }
}

export default NotificationService; 