import { Repository, In} from 'typeorm';
import { Achievement } from '../entities/achievements.entity';
import AppDataSource from '../data-source';

export class AchievementsRepository {
  private repository: Repository<Achievement>;

  constructor() {
    this.repository = AppDataSource.getRepository(Achievement);
  }

  /**
   * Encontra todas as conquistas
   */
  async findAll(): Promise<Achievement[]> {
    return this.repository.find({
      order: { timestamp: 'DESC' }
    });
  }

  /**
   * Encontra uma conquista pelo ID
   */
  async findById(id: string): Promise<Achievement | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Encontra conquistas por tipo
   */
  async findByType(achievementType: string): Promise<Achievement[]> {
    return this.repository.find({
      where: { achievement_type: achievementType },
      order: { timestamp: 'DESC' }
    });
  }

  /**
   * Encontra conquistas não sincronizadas
   */
  async findPendingSync(): Promise<Achievement[]> {
    return this.repository.find({
      where: { synced: 0 },
      order: { created_at: 'ASC' }
    });
  }

  /**
   * Verifica se uma conquista específica já existe
   */
  async achievementExists(achievementType: string, metadata: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { 
        achievement_type: achievementType,
        metadata
      }
    });
    
    return count > 0;
  }

  /**
   * Cria uma nova conquista
   */
  async create(achievement: Partial<Achievement>): Promise<Achievement> {
    const newAchievement = this.repository.create({
      ...achievement,
      timestamp: achievement.timestamp || Date.now(),
      created_at: Date.now()
    });
    
    return this.repository.save(newAchievement);
  }

  /**
   * Marca conquistas como sincronizadas
   */
  async markAsSynced(ids: string[]): Promise<void> {
    await this.repository.update(
      { id: In(ids) },
      { synced: 1 }
    );
  }

  /**
   * Conta o número total de conquistas por tipo
   */
  async countByType(): Promise<Record<string, number>> {
    const counts = await this.repository
      .createQueryBuilder('achievement')
      .select('achievement.achievement_type', 'type')
      .addSelect('COUNT(achievement.id)', 'count')
      .groupBy('achievement.achievement_type')
      .getRawMany();
    
    return counts.reduce((acc, curr) => {
      acc[curr.type] = parseInt(curr.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Obtém as conquistas mais recentes
   */
  async getRecentAchievements(limit = 5): Promise<Achievement[]> {
    return this.repository.find({
      order: { timestamp: 'DESC' },
      take: limit
    });
  }
}