import DatabaseService from './DatabaseService';
import ScreenTimeService, { DailySummary } from './ScreenTimeService';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckDate: string;
  totalDaysCompleted: number;
}

export interface GamificationStats {
  streakData: StreakData;
  isFireActive: boolean;
  fireColor: string;
  motivationalMessage: string;
}

class GamificationService {
  private static instance: GamificationService;
  private databaseService: DatabaseService;
  private screenTimeService: ScreenTimeService;

  private constructor() {
    this.databaseService = DatabaseService.getInstance();
    this.screenTimeService = ScreenTimeService.getInstance();
  }

  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // Verificar se o usuário atingiu a meta diária
  async checkDailyGoalAchievement(date: string): Promise<boolean> {
    try {
      const dailySummary = await this.screenTimeService.getDailySummary(date);
      if (!dailySummary) return false;

      const goalHours = await this.databaseService.getSetting('daily_goal_hours');
      const goalSeconds = goalHours ? parseFloat(goalHours) * 3600 : 14400; // 4 horas padrão em segundos

      // Verificar se o uso total está dentro da meta
      return dailySummary.totalUsage <= goalSeconds;
    } catch (error) {
      console.error('Erro ao verificar meta diária:', error);
      return false;
    }
  }

  // Atualizar streak baseado no desempenho diário
  async updateStreak(date: string): Promise<StreakData> {
    try {
      const goalAchieved = await this.checkDailyGoalAchievement(date);
      const currentStreakData = await this.getStreakData();

      let newStreakData: StreakData;

      if (goalAchieved) {
        // Meta atingida - incrementar streak
        const isNewDay = currentStreakData.lastCheckDate !== date;
        
        if (isNewDay) {
          newStreakData = {
            currentStreak: currentStreakData.currentStreak + 1,
            longestStreak: Math.max(currentStreakData.currentStreak + 1, currentStreakData.longestStreak),
            lastCheckDate: date,
            totalDaysCompleted: currentStreakData.totalDaysCompleted + 1
          };
        } else {
          // Mesmo dia, manter streak atual
          newStreakData = currentStreakData;
        }
      } else {
        // Meta não atingida - resetar streak
        newStreakData = {
          currentStreak: 0,
          longestStreak: currentStreakData.longestStreak,
          lastCheckDate: date,
          totalDaysCompleted: currentStreakData.totalDaysCompleted
        };
      }

      // Salvar no banco de dados
      await this.saveStreakData(newStreakData);
      return newStreakData;
    } catch (error) {
      console.error('Erro ao atualizar streak:', error);
      return await this.getStreakData();
    }
  }

  // Obter dados do streak
  async getStreakData(): Promise<StreakData> {
    try {
      const currentStreak = await this.databaseService.getSetting('current_streak');
      const longestStreak = await this.databaseService.getSetting('longest_streak');
      const lastCheckDate = await this.databaseService.getSetting('last_check_date');
      const totalDaysCompleted = await this.databaseService.getSetting('total_days_completed');

      return {
        currentStreak: currentStreak ? parseInt(currentStreak) : 0,
        longestStreak: longestStreak ? parseInt(longestStreak) : 0,
        lastCheckDate: lastCheckDate || '',
        totalDaysCompleted: totalDaysCompleted ? parseInt(totalDaysCompleted) : 0
      };
    } catch (error) {
      console.error('Erro ao obter dados do streak:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCheckDate: '',
        totalDaysCompleted: 0
      };
    }
  }

  // Salvar dados do streak
  private async saveStreakData(streakData: StreakData): Promise<void> {
    try {
      await this.databaseService.setSetting('current_streak', streakData.currentStreak.toString());
      await this.databaseService.setSetting('longest_streak', streakData.longestStreak.toString());
      await this.databaseService.setSetting('last_check_date', streakData.lastCheckDate);
      await this.databaseService.setSetting('total_days_completed', streakData.totalDaysCompleted.toString());
    } catch (error) {
      console.error('Erro ao salvar dados do streak:', error);
    }
  }

  // Obter estatísticas de gamificação
  async getGamificationStats(): Promise<GamificationStats> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const streakData = await this.updateStreak(today);
      const goalAchieved = await this.checkDailyGoalAchievement(today);

      const isFireActive = goalAchieved && streakData.currentStreak > 0;
      const fireColor = this.getFireColor(streakData.currentStreak);
      const motivationalMessage = this.getMotivationalMessage(streakData, goalAchieved);

      return {
        streakData,
        isFireActive,
        fireColor,
        motivationalMessage
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de gamificação:', error);
      return {
        streakData: await this.getStreakData(),
        isFireActive: false,
        fireColor: '#ccc',
        motivationalMessage: 'Comece hoje sua jornada!'
      };
    }
  }

  // Determinar cor do foguinho baseado no streak
  private getFireColor(streak: number): string {
    if (streak === 0) return '#ccc'; // Cinza - inativo
    if (streak <= 3) return '#FF6B35'; // Laranja - início
    if (streak <= 7) return '#FF4500'; // Vermelho-laranja - uma semana
    if (streak <= 14) return '#FF0000'; // Vermelho - duas semanas
    if (streak <= 30) return '#FF1493'; // Rosa - um mês
    return '#FFD700'; // Dourado - mais de um mês
  }

  // Gerar mensagem motivacional
  private getMotivationalMessage(streakData: StreakData, goalAchieved: boolean): string {
    if (!goalAchieved) {
      return 'Comece hoje sua sequência!';
    }

    if (streakData.currentStreak === 1) {
      return 'Primeiro dia! Continue assim!';
    }

    if (streakData.currentStreak <= 3) {
      return 'Ótimo começo! Continue firme!';
    }

    if (streakData.currentStreak <= 7) {
      return 'Uma semana! Você está no caminho certo!';
    }

    if (streakData.currentStreak <= 14) {
      return 'Duas semanas! Incrível consistência!';
    }

    if (streakData.currentStreak <= 30) {
      return 'Um mês! Você é uma inspiração!';
    }

    return 'Mais de um mês! Você é um exemplo!';
  }

  // Resetar streak (útil para testes)
  async resetStreak(): Promise<void> {
    try {
      const resetData: StreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastCheckDate: '',
        totalDaysCompleted: 0
      };
      await this.saveStreakData(resetData);
    } catch (error) {
      console.error('Erro ao resetar streak:', error);
    }
  }
}

export default GamificationService; 