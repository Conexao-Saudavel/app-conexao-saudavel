import { Repository, Between, LessThan, In } from 'typeorm';
import { DailySummary } from '../entities/monitoring/daily_summary.entity';
import AppDataSource from '../data-source';

export class DailySummaryRepository {
  private repository: Repository<DailySummary>;

  constructor() {
    this.repository = AppDataSource.getRepository(DailySummary);
  }

  /**
   * Encontra o resumo de um dia específico
   */
  async findByDate(date: string): Promise<DailySummary | null> {
    return this.repository.findOneBy({ date });
  }

  /**
   * Encontra resumos dentro de um intervalo de datas
   */
  async findByDateRange(startDate: string, endDate: string): Promise<DailySummary[]> {
    return this.repository.find({
      where: {
        date: Between(startDate, endDate)
      },
      order: { date: 'ASC' }
    });
  }

  /**
   * Obtém os resumos diários mais recentes
   */
  async findRecent(limit = 7): Promise<DailySummary[]> {
    return this.repository.find({
      order: { date: 'DESC' },
      take: limit
    });
  }

  /**
   * Encontra resumos pendentes de sincronização
   */
  async findPendingSync(): Promise<DailySummary[]> {
    return this.repository.find({
      where: { synced: 0 },
      order: { date: 'ASC' }
    });
  }

  /**
   * Cria ou atualiza um resumo diário
   */
  async createOrUpdate(summary: Partial<DailySummary>): Promise<DailySummary> {
    const { date } = summary;
    
    if (!date) {
      throw new Error('Date is required for daily summary');
    }
    
    const existingSummary = await this.findByDate(date);
    
    if (existingSummary) {
      await this.repository.update({ date }, summary);
      return this.findByDate(date) as Promise<DailySummary>;
    } else {
      const newSummary = this.repository.create(summary);
      return this.repository.save(newSummary);
    }
  }

  /**
   * Marca resumos como sincronizados
   */
  async markAsSynced(dates: string[]): Promise<void> {
    await this.repository.update(
      { date: In(dates) },
      { synced: 1 }
    );
  }

  /**
   * Calcula a sequência atual (streak) de dias com meta alcançada
   */
  async getCurrentStreak(targetCompletion = 100): Promise<number> {
    const summaries = await this.repository.find({
      order: { date: 'DESC' },
      take: 30 // Limita a busca para performance
    });
    
    let streak = 0;
    for (const summary of summaries) {
      if (summary.goal_completion >= targetCompletion) {
        streak += 1;
      } else {
        break;
      }
    }
    
    return streak;
  }

  /**
   * Obtém estatísticas de uso para um intervalo de datas
   */
  async getUsageStats(startDate: string, endDate: string): Promise<any> {
    const summaries = await this.findByDateRange(startDate, endDate);
    
    let totalUsage = 0;
    let daysWithData = 0;
    let daysAboveGoal = 0;
    
    summaries.forEach(summary => {
      if (summary.total_usage) {
        totalUsage += summary.total_usage;
        daysWithData += 1;
        
        if (summary.goal_completion >= 100) {
          daysAboveGoal += 1;
        }
      }
    });
    
    return {
      totalDays: summaries.length,
      daysWithData,
      daysAboveGoal,
      averageUsage: daysWithData > 0 ? totalUsage / daysWithData : 0,
      goalCompletionRate: daysWithData > 0 ? (daysAboveGoal / daysWithData) * 100 : 0
    };
  }

  /**
   * Remove resumos antigos
   */
  async deleteOldSummaries(olderThan: string): Promise<void> {
    await this.repository.delete({
      date: LessThan(olderThan)
    });
  }
}