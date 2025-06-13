import { useDatabase } from '../hooks/useDatabase';
import { buildApiUrl, API_CONFIG } from '../config/api';

export interface UsageDataForServer {
  timestamp: number;
  date: string;
  apps: {
    packageName: string;
    appName: string;
    totalTimeInForeground: number;
    lastTimeUsed: number;
    isSocialMedia: boolean;
  }[];
  totalSocialMediaTime: number;
  deviceId?: string;
  userId?: string;
}

class UsageDataService {
  private static instance: UsageDataService;
  private database: any = null;

  private constructor() {}

  public static getInstance(): UsageDataService {
    if (!UsageDataService.instance) {
      UsageDataService.instance = new UsageDataService();
    }
    return UsageDataService.instance;
  }

  public setDatabase(db: any) {
    this.database = db;
  }

  // Buscar dados do SQLite
  public async getUsageDataFromSQLite(): Promise<UsageDataForServer | null> {
    if (!this.database) {
      console.error('Database não inicializada');
      return null;
    }

    try {
      const result = await this.database.transaction((tx: any) => {
        return new Promise((resolve, reject) => {
          tx.executeSql(
            'SELECT * FROM app_usage ORDER BY total_time DESC LIMIT 10',
            [],
            (_: any, result: any) => {
              const apps = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                apps.push({
                  packageName: row.package_name,
                  appName: row.app_name,
                  totalTimeInForeground: row.total_time,
                  lastTimeUsed: row.last_used,
                  isSocialMedia: Boolean(row.is_social_media),
                });
              }
              resolve(apps);
            },
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      });

      const now = new Date();
      const totalSocialMediaTime = (result as any[])
        .filter(app => app.isSocialMedia)
        .reduce((total, app) => total + app.totalTimeInForeground, 0);

      return {
        timestamp: now.getTime(),
        date: now.toISOString().split('T')[0],
        apps: result as any[],
        totalSocialMediaTime,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do SQLite:', error);
      return null;
    }
  }

  // Enviar dados para o servidor
  public async sendUsageDataToServer(data: UsageDataForServer): Promise<boolean> {
    try {
      // Implementação real usando a configuração centralizada
      const response = await fetch(buildApiUrl(API_CONFIG.SYNC.USAGE_DATA), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Adicionar headers de autenticação se necessário
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Dados enviados com sucesso para o servidor');
        return true;
      } else {
        console.error('Erro ao enviar dados:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o servidor:', error);
      return false;
    }
  }

  // Sincronizar dados (buscar do SQLite e enviar para o servidor)
  public async syncUsageData(): Promise<boolean> {
    try {
      const data = await this.getUsageDataFromSQLite();
      if (!data) {
        console.log('Nenhum dado para sincronizar');
        return false;
      }

      const success = await this.sendUsageDataToServer(data);
      if (success) {
        console.log('Sincronização concluída com sucesso');
        return true;
      } else {
        console.log('Falha na sincronização');
        return false;
      }
    } catch (error) {
      console.error('Erro durante a sincronização:', error);
      return false;
    }
  }

  // Marcar dados como sincronizados (opcional)
  public async markAsSynced(): Promise<void> {
    if (!this.database) return;

    try {
      await this.database.transaction((tx: any) => {
        tx.executeSql('UPDATE app_usage SET synced = 1 WHERE synced = 0');
      });
    } catch (error) {
      console.error('Erro ao marcar dados como sincronizados:', error);
    }
  }
}

export default UsageDataService; 