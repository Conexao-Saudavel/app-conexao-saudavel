import { Repository } from 'typeorm';
import { SyncLog } from '../entities/sync_log.entity';
import AppDataSource from '../data-source';

export class SyncLogRepository {
  private repository: Repository<SyncLog>;

  constructor() {
    this.repository = AppDataSource.getRepository(SyncLog);
  }

  /**
   * Encontra todos os registros de sincronização
   */
  async findAll(limit = 50): Promise<SyncLog[]> {
    return this.repository.find({
      order: { timestamp: 'DESC' },
      take: limit
    });
  }

  /**
   * Encontra um registro de sincronização pelo ID
   */
  async findById(id: string): Promise<SyncLog | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Encontra as sincronizações mais recentes
   */
  async findRecent(limit = 5): Promise<SyncLog[]> {
    return this.repository.find({
      order: { timestamp: 'DESC' },
      take: limit
    });
  }

  /**
   * Encontra as sincronizações com falha
   */
  async findFailed(): Promise<SyncLog[]> {
    return this.repository.find({
      where: { status: 'failed' },
      order: { timestamp: 'DESC' }
    });
  }

  /**
   * Cria um novo registro de sincronização
   */
  async createSyncStart(connectionType?: string): Promise<SyncLog> {
    const syncLog = this.repository.create({
      id: this.generateUUID(),
      timestamp: Date.now(),
      status: 'in_progress',
      connection_type: connectionType
    });
    return this.repository.save(syncLog);
  }

  /**
   * Atualiza um registro de sincronização com o resultado
   */
  async completeSyncLog(
    id: string,
    status: 'success' | 'failed' | 'partial',
    data: {
      recordsSent?: number;
      recordsReceived?: number;
      errorMessage?: string;
      serverResponse?: string;
    }
  ): Promise<SyncLog | null> {
    await this.repository.update(id, {
      completion_time: Date.now(),
      status,
      records_sent: data.recordsSent || 0,
      records_received: data.recordsReceived || 0,
      error_message: data.errorMessage,
      server_response: data.serverResponse
    });
    return this.findById(id);
  }

  /**
   * Obtém estatísticas de sincronização
   */
  async getSyncStats(): Promise<any> {
    const totalCount = await this.repository.count();
    const failedCount = await this.repository.count({ where: { status: 'failed' } });
    const successCount = await this.repository.count({ where: { status: 'success' } });
    const partialCount = await this.repository.count({ where: { status: 'partial' } });
    
    const recordsSent = await this.repository
      .createQueryBuilder('sync')
      .select('SUM(sync.records_sent)', 'total')
      .getRawOne();
    
    const recordsReceived = await this.repository
      .createQueryBuilder('sync')
      .select('SUM(sync.records_received)', 'total')
      .getRawOne();
    
    return {
      totalSyncs: totalCount,
      failedSyncs: failedCount,
      successSyncs: successCount,
      partialSyncs: partialCount,
      totalRecordsSent: parseInt(recordsSent?.total || '0', 10),
      totalRecordsReceived: parseInt(recordsReceived?.total || '0', 10)
    };
  }

  /**
   * Limpa registros de sincronização antigos, mantendo apenas os mais recentes
   */
  async cleanup(keepCount = 100): Promise<void> {
    const logs = await this.repository.find({
      order: { timestamp: 'DESC' },
      skip: keepCount
    });
    
    if (logs.length > 0) {
      const idsToDelete = logs.map(log => log.id);
      await this.repository.delete(idsToDelete);
    }
  }

  /**
   * Utilitário para gerar UUID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}