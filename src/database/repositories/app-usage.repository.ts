import { Repository, Between, LessThan, In, IsNull } from 'typeorm';
import { AppUsage } from '../entities/monitoring/app_usage.entity';
import AppDataSource from '../data-source';

export class AppUsageRepository {
  private repository: Repository<AppUsage>;

  constructor() {
    this.repository = AppDataSource.getRepository(AppUsage);
  }

  /**
   * Encontra todos os registros de uso de aplicativos
   */
  async findAll(): Promise<AppUsage[]> {
    return this.repository.find();
  }

  /**
   * Encontra um registro de uso pelo ID
   */
  async findById(id: string): Promise<AppUsage | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Encontra registros de uso por nome do pacote do aplicativo
   */
  async findByPackageName(packageName: string): Promise<AppUsage[]> {
    return this.repository.find({
      where: { package_name: packageName },
      order: { start_time: 'DESC' }
    });
  }

  /**
   * Encontra registros de uso dentro de um intervalo de datas
   */
  async findByDateRange(startTime: number, endTime: number): Promise<AppUsage[]> {
    return this.repository.find({
      where: {
        start_time: Between(startTime, endTime)
      },
      order: { start_time: 'ASC' }
    });
  }

  /**
   * Encontra registros de uso em andamento (sem end_time)
   */
  async findOngoingSessions(): Promise<AppUsage[]> {
    return this.repository.find({
      where: { end_time: IsNull() },
      order: { start_time: 'DESC' }
    });
  }

  /**
   * Encontra registros pendentes de sincronização
   */
  async findPendingSync(limit = 100): Promise<AppUsage[]> {
    return this.repository.find({
      where: { synced: 0 },
      order: { created_at: 'ASC' },
      take: limit
    });
  }

  /**
   * Cria um novo registro de uso
   */
  async create(appUsage: Partial<AppUsage>): Promise<AppUsage> {
    const newAppUsage = this.repository.create(appUsage);
    return this.repository.save(newAppUsage);
  }

  /**
   * Atualiza um registro de uso existente
   */
  async update(id: string, appUsage: Partial<AppUsage>): Promise<AppUsage | null> {
    await this.repository.update(id, appUsage);
    return this.findById(id);
  }

  /**
   * Finaliza uma sessão de uso definindo o end_time
   */
  async endSession(id: string, endTime: number): Promise<AppUsage | null> {
    await this.repository.update(id, { end_time: endTime });
    return this.findById(id);
  }

  /**
   * Marca registros como sincronizados
   */
  async markAsSynced(ids: string[], syncId: string): Promise<void> {
    await this.repository.update(
      { id: In(ids) },
      { 
        synced: 1, 
        sync_id: syncId
      }
    );
  }

  /**
   * Obtém estatísticas de uso por categoria
   */
  async getUsageByCategory(startTime: number, endTime: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('usage')
      .select('usage.category', 'category')
      .addSelect('SUM(usage.duration)', 'total_duration')
      .where('usage.start_time >= :startTime', { startTime })
      .andWhere('usage.end_time <= :endTime', { endTime })
      .andWhere('usage.duration IS NOT NULL')
      .groupBy('usage.category')
      .orderBy('total_duration', 'DESC')
      .getRawMany();
  }

  /**
   * Remove registros antigos (útil para limpeza de dados)
   */
  async deleteOldRecords(olderThan: number): Promise<void> {
    await this.repository.delete({
      created_at: LessThan(olderThan)
    });
  }
}