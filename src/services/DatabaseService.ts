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
      await this.executeQuery(query);
    }
  }

  private executeQuery(query: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Métodos para AppUsage
  async saveAppUsage(usage: AppUsage): Promise<void> {
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
  }

  async getAppUsageHistory(startDate: string, endDate: string): Promise<AppUsage[]> {
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
  }

  // Métodos para DailySummary
  async saveDailySummary(summary: DailySummary): Promise<void> {
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
  }

  async getDailySummary(date: string): Promise<DailySummary | null> {
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
  }

  // Métodos de utilidade
  async clearAllData(): Promise<void> {
    const queries = [
      'DELETE FROM app_usage',
      'DELETE FROM app_breakdown',
      'DELETE FROM daily_summary'
    ];

    for (const query of queries) {
      await this.executeQuery(query);
    }
  }

  // Métodos para configurações
  async getSetting(key: string): Promise<string | null> {
    const result = await this.executeQuery(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return result.rows.length > 0 ? result.rows.item(0).value : null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.executeQuery(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }
}

export default DatabaseService; 