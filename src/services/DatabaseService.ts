import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { AppUsage, DailySummary } from './ScreenTimeService';

class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.WebSQLDatabase;

  private constructor() {
    this.db = SQLite.openDatabase('conexao_saudavel.db');
    this.initDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async initDatabase(): Promise<void> {
    try {
      const queries = [
        `CREATE TABLE IF NOT EXISTS app_usage (
          id TEXT PRIMARY KEY,
          package_name TEXT NOT NULL,
          app_name TEXT NOT NULL,
          start_time INTEGER NOT NULL,
          end_time INTEGER NOT NULL,
          duration INTEGER NOT NULL,
          category TEXT NOT NULL,
          foreground INTEGER NOT NULL,
          metadata TEXT,
          synced INTEGER NOT NULL DEFAULT 0,
          sync_id TEXT,
          sync_attempt_count INTEGER NOT NULL DEFAULT 0,
          last_sync_attempt INTEGER,
          created_at INTEGER NOT NULL,
          is_manual_entry INTEGER NOT NULL DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS daily_summary (
          date TEXT PRIMARY KEY,
          total_usage INTEGER NOT NULL,
          goal_completion REAL NOT NULL,
          most_used_app TEXT NOT NULL,
          streak_count INTEGER NOT NULL,
          calculated_at INTEGER NOT NULL,
          synced INTEGER NOT NULL DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS app_breakdown (
          date TEXT NOT NULL,
          package_name TEXT NOT NULL,
          app_name TEXT NOT NULL,
          duration INTEGER NOT NULL,
          category TEXT NOT NULL,
          PRIMARY KEY (date, package_name),
          FOREIGN KEY (date) REFERENCES daily_summary(date)
        )`,
        `CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )`
      ];

      for (const query of queries) {
        try {
          await this.executeQuery(query);
        } catch (error) {
          console.error('Erro ao executar query:', query, error);
        }
      }

      // Inicializar configurações padrão se não existirem
      await this.initializeDefaultSettings();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
  }

  private async initializeDefaultSettings(): Promise<void> {
    try {
      console.log('Inicializando configurações padrão...');
      
      const defaultSettings = [
        { key: 'has_wellbeing_access', value: 'false' },
        { key: 'first_run', value: 'true' },
        { key: 'daily_goal_hours', value: '4' },
        { key: 'notifications_enabled', value: 'true' },
        // Configurações de gamificação
        { key: 'current_streak', value: '0' },
        { key: 'longest_streak', value: '0' },
        { key: 'last_check_date', value: '' },
        { key: 'total_days_completed', value: '0' },
        // Configurações de notificações
        { key: 'near_goal_threshold', value: '80' }, // 80% da meta
        { key: 'exceeded_goal_enabled', value: 'true' },
        { key: 'motivational_enabled', value: 'true' }
      ];

      for (const setting of defaultSettings) {
        const existing = await this.getSetting(setting.key);
        if (existing === null) {
          await this.setSetting(setting.key, setting.value);
          console.log(`✓ Configuração padrão definida: ${setting.key} = '${setting.value}'`);
        } else {
          console.log(`- Configuração já existe: ${setting.key} = '${existing}'`);
        }
      }
      
      console.log('Inicialização de configurações padrão concluída');
    } catch (error) {
      console.error('Erro ao inicializar configurações padrão:', error);
    }
  }

  private executeQuery(query: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction(tx => {
          tx.executeSql(
            query,
            params,
            (_, result) => resolve(result),
            (_, error) => {
              console.error('Erro na query SQL:', error);
              reject(error);
              return false;
            }
          );
        });
      } catch (error) {
        console.error('Erro ao executar transação:', error);
        reject(error);
      }
    });
  }

  // Métodos para AppUsage
  async saveAppUsage(usage: AppUsage): Promise<void> {
    try {
      const query = `
        INSERT INTO app_usage (
          id, package_name, app_name, start_time, end_time, duration,
          category, foreground, metadata, synced, sync_id,
          sync_attempt_count, last_sync_attempt, created_at, is_manual_entry
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        usage.id,
        usage.packageName,
        usage.appName,
        usage.startTime,
        usage.endTime,
        usage.duration,
        usage.category,
        usage.foreground ? 1 : 0,
        usage.metadata || null,
        usage.synced ? 1 : 0,
        usage.syncId || null,
        usage.syncAttemptCount,
        usage.lastSyncAttempt || null,
        usage.createdAt,
        usage.isManualEntry ? 1 : 0
      ];

      await this.executeQuery(query, params);
    } catch (error) {
      console.error('Erro ao salvar uso do app:', error);
    }
  }

  async getAppUsageHistory(startDate: string, endDate: string): Promise<AppUsage[]> {
    try {
      const query = `
        SELECT * FROM app_usage
        WHERE date(start_time/1000, 'unixepoch') >= ?
        AND date(start_time/1000, 'unixepoch') <= ?
        ORDER BY start_time ASC
      `;

      const result = await this.executeQuery(query, [startDate, endDate]);
      return result.rows._array.map(row => ({
        id: row.id,
        packageName: row.package_name,
        appName: row.app_name,
        startTime: row.start_time,
        endTime: row.end_time,
        duration: row.duration,
        category: row.category,
        foreground: Boolean(row.foreground),
        metadata: row.metadata,
        synced: Boolean(row.synced),
        syncId: row.sync_id,
        syncAttemptCount: row.sync_attempt_count,
        lastSyncAttempt: row.last_sync_attempt,
        createdAt: row.created_at,
        isManualEntry: Boolean(row.is_manual_entry)
      }));
    } catch (error) {
      console.error('Erro ao obter histórico de uso:', error);
      return [];
    }
  }

  // Métodos para DailySummary
  async saveDailySummary(summary: DailySummary): Promise<void> {
    try {
      const summaryQuery = `
        INSERT OR REPLACE INTO daily_summary (
          date, total_usage, goal_completion, most_used_app,
          streak_count, calculated_at, synced
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const summaryParams = [
        summary.date,
        summary.totalUsage,
        summary.goalCompletion,
        summary.mostUsedApp,
        summary.streakCount,
        summary.calculatedAt,
        summary.synced ? 1 : 0
      ];

      await this.executeQuery(summaryQuery, summaryParams);

      // Salvar breakdown dos apps
      for (const [packageName, data] of Object.entries(summary.appBreakdown)) {
        const breakdownQuery = `
          INSERT OR REPLACE INTO app_breakdown (
            date, package_name, app_name, duration, category
          ) VALUES (?, ?, ?, ?, ?)
        `;

        const breakdownParams = [
          summary.date,
          packageName,
          data.name,
          data.duration,
          data.category
        ];

        await this.executeQuery(breakdownQuery, breakdownParams);
      }
    } catch (error) {
      console.error('Erro ao salvar resumo diário:', error);
    }
  }

  async getDailySummary(date: string): Promise<DailySummary | null> {
    try {
      const summaryQuery = `
        SELECT * FROM daily_summary WHERE date = ?
      `;
      const summaryResult = await this.executeQuery(summaryQuery, [date]);
      
      if (summaryResult.rows.length === 0) {
        return null;
      }

      const summary = summaryResult.rows.item(0);
      
      const breakdownQuery = `
        SELECT * FROM app_breakdown WHERE date = ?
      `;
      const breakdownResult = await this.executeQuery(breakdownQuery, [date]);
      
      const appBreakdown: { [key: string]: { name: string; duration: number; category: string } } = {};
      
      for (let i = 0; i < breakdownResult.rows.length; i++) {
        const row = breakdownResult.rows.item(i);
        appBreakdown[row.package_name] = {
          name: row.app_name,
          duration: row.duration,
          category: row.category
        };
      }

      return {
        date: summary.date,
        totalUsage: summary.total_usage,
        appBreakdown,
        goalCompletion: summary.goal_completion,
        mostUsedApp: summary.most_used_app,
        streakCount: summary.streak_count,
        calculatedAt: summary.calculated_at,
        synced: Boolean(summary.synced)
      };
    } catch (error) {
      console.error('Erro ao obter resumo diário:', error);
      return null;
    }
  }

  // Métodos de utilidade
  async clearAllData(): Promise<void> {
    try {
      const queries = [
        'DELETE FROM app_usage',
        'DELETE FROM daily_summary',
        'DELETE FROM app_breakdown',
        'DELETE FROM settings'
      ];

      for (const query of queries) {
        await this.executeQuery(query);
      }
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }

  // Métodos para configurações
  async getSetting(key: string): Promise<string | null> {
    try {
      const query = 'SELECT value FROM settings WHERE key = ?';
      const result = await this.executeQuery(query, [key]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows.item(0).value;
    } catch (error) {
      console.error('Erro ao obter configuração:', error);
      return null;
    }
  }

  async setSetting(key: string, value: string): Promise<void> {
    try {
      const query = 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)';
      await this.executeQuery(query, [key, value]);
    } catch (error) {
      console.error('Erro ao definir configuração:', error);
    }
  }

  // Método para resetar o onboarding (útil para testes)
  async resetOnboarding(): Promise<void> {
    try {
      console.log('=== INICIANDO RESET COMPLETO DO ONBOARDING ===');
      
      // 1. Limpar todas as configurações relacionadas ao onboarding
      const settingsToReset = [
        'first_run',
        'daily_goal_hours',
        'notifications_enabled',
        'has_wellbeing_access',
        'last_sync_timestamp'
      ];

      console.log('Removendo configurações...');
      for (const setting of settingsToReset) {
        const deleteQuery = 'DELETE FROM settings WHERE key = ?';
        await this.executeQuery(deleteQuery, [setting]);
        console.log(`✓ Configuração '${setting}' removida`);
      }

      // 2. Limpar dados de uso
      console.log('Limpando dados de uso...');
      await this.clearAllUsageData();
      console.log('✓ Dados de uso limpos');

      // 3. Verificar se a tabela settings existe e está vazia
      const checkQuery = 'SELECT COUNT(*) as count FROM settings';
      const checkResult = await this.executeQuery(checkQuery);
      const settingsCount = checkResult.rows.item(0).count;
      console.log(`Configurações restantes na tabela: ${settingsCount}`);

      // 4. Definir first_run como true explicitamente
      console.log('Definindo first_run como true...');
      await this.setSetting('first_run', 'true');
      
      // 5. Verificar se foi salvo corretamente
      const verifyQuery = 'SELECT value FROM settings WHERE key = ?';
      const verifyResult = await this.executeQuery(verifyQuery, ['first_run']);
      
      if (verifyResult.rows.length > 0) {
        const savedValue = verifyResult.rows.item(0).value;
        console.log(`✓ first_run salvo com valor: '${savedValue}'`);
      } else {
        console.log('❌ ERRO: first_run não foi salvo!');
      }

      // 6. Listar todas as configurações para debug
      const allSettingsQuery = 'SELECT key, value FROM settings';
      const allSettingsResult = await this.executeQuery(allSettingsQuery);
      console.log('Configurações atuais na tabela:');
      for (let i = 0; i < allSettingsResult.rows.length; i++) {
        const row = allSettingsResult.rows.item(i);
        console.log(`  - ${row.key}: '${row.value}'`);
      }
      
      console.log('=== RESET DO ONBOARDING CONCLUÍDO ===');
    } catch (error) {
      console.error('❌ Erro ao resetar onboarding:', error);
      throw error;
    }
  }

  // Método para apagar todos os dados coletados
  async clearAllUsageData(): Promise<void> {
    try {
      const queries = [
        'DELETE FROM app_usage',
        'DELETE FROM daily_summary',
        'DELETE FROM app_breakdown'
      ];

      for (const query of queries) {
        await this.executeQuery(query);
      }
      
      console.log('Todos os dados de uso foram apagados');
    } catch (error) {
      console.error('Erro ao apagar dados de uso:', error);
      throw error;
    }
  }

  // Método para obter dados para sincronização
  async getDataForSync(): Promise<any> {
    try {
      // Obter dados de uso não sincronizados
      const usageQuery = `
        SELECT * FROM app_usage 
        WHERE synced = 0 
        ORDER BY created_at ASC
      `;
      const usageResult = await this.executeQuery(usageQuery);
      
      // Obter resumos diários não sincronizados
      const summaryQuery = `
        SELECT * FROM daily_summary 
        WHERE synced = 0 
        ORDER BY date ASC
      `;
      const summaryResult = await this.executeQuery(summaryQuery);
      
      return {
        usageData: usageResult.rows._array,
        summaryData: summaryResult.rows._array,
        syncTimestamp: Date.now()
      };
    } catch (error) {
      console.error('Erro ao obter dados para sincronização:', error);
      throw error;
    }
  }

  // Método para marcar dados como sincronizados
  async markDataAsSynced(syncIds: string[]): Promise<void> {
    try {
      for (const syncId of syncIds) {
        await this.executeQuery(
          'UPDATE app_usage SET synced = 1, sync_id = ? WHERE id = ?',
          [syncId, syncId]
        );
      }
      
      console.log(`${syncIds.length} registros marcados como sincronizados`);
    } catch (error) {
      console.error('Erro ao marcar dados como sincronizados:', error);
      throw error;
    }
  }

  // Método para obter status de sincronização
  async getSyncStatus(): Promise<{lastSync: number | null, pendingRecords: number}> {
    try {
      const pendingQuery = 'SELECT COUNT(*) as count FROM app_usage WHERE synced = 0';
      const result = await this.executeQuery(pendingQuery);
      const pendingRecords = result.rows.item(0).count;
      
      const lastSyncSetting = await this.getSetting('last_sync_timestamp');
      const lastSync = lastSyncSetting ? parseInt(lastSyncSetting) : null;
      
      return {
        lastSync,
        pendingRecords
      };
    } catch (error) {
      console.error('Erro ao obter status de sincronização:', error);
      return {
        lastSync: null,
        pendingRecords: 0
      };
    }
  }

  // Método para listar todas as configurações (útil para debug)
  async getAllSettings(): Promise<{key: string, value: string}[]> {
    try {
      const query = 'SELECT key, value FROM settings ORDER BY key';
      const result = await this.executeQuery(query);
      
      const settings: {key: string, value: string}[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        settings.push({
          key: row.key,
          value: row.value
        });
      }
      
      return settings;
    } catch (error) {
      console.error('Erro ao listar configurações:', error);
      return [];
    }
  }

  // Método para recriar completamente o banco de dados (útil para resolver problemas de cache)
  async recreateDatabase(): Promise<void> {
    try {
      console.log('=== RECRIANDO BANCO DE DADOS COMPLETAMENTE ===');
      
      // 1. Dropar todas as tabelas
      const dropQueries = [
        'DROP TABLE IF EXISTS app_usage',
        'DROP TABLE IF EXISTS daily_summary',
        'DROP TABLE IF EXISTS app_breakdown',
        'DROP TABLE IF EXISTS settings'
      ];

      console.log('Removendo tabelas existentes...');
      for (const query of dropQueries) {
        await this.executeQuery(query);
        console.log(`✓ Tabela removida: ${query}`);
      }

      // 2. Recriar tabelas
      console.log('Recriando tabelas...');
      await this.initDatabase();
      console.log('✓ Tabelas recriadas');

      // 3. Inicializar configurações padrão
      console.log('Inicializando configurações padrão...');
      await this.initializeDefaultSettings();
      console.log('✓ Configurações padrão inicializadas');

      // 4. Verificar se tudo foi criado corretamente
      const allSettings = await this.getAllSettings();
      console.log('Configurações após recriação:');
      allSettings.forEach(setting => {
        console.log(`  - ${setting.key}: '${setting.value}'`);
      });

      console.log('=== BANCO DE DADOS RECRIADO COM SUCESSO ===');
    } catch (error) {
      console.error('❌ Erro ao recriar banco de dados:', error);
      throw error;
    }
  }
}

export default DatabaseService; 