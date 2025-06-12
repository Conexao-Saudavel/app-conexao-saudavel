import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import UsageDataService from '../services/UsageDataService';

export const useDatabase = () => {
  const [db, setDb] = useState<SQLite.WebSQLDatabase | null>(null);

  useEffect(() => {
    const database = SQLite.openDatabase('wellbeing.db');
    
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS app_usage (
          package_name TEXT PRIMARY KEY,
          app_name TEXT,
          total_time INTEGER,
          last_used INTEGER,
          is_social_media INTEGER DEFAULT 0
        )`
      );
      
      tx.executeSql(
        `ALTER TABLE app_usage ADD COLUMN is_social_media INTEGER DEFAULT 0`
      );
    });

    setDb(database);
    
    const usageDataService = UsageDataService.getInstance();
    usageDataService.setDatabase(database);
  }, []);

  return { db };
}; 