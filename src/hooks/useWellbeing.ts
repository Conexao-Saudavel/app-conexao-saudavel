import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import { useDatabase } from './useDatabase';
import { ConvertTimeToReadableFormat } from '../utils/FormatTime';
import UsageDataService from '../services/UsageDataService';

const { AppUsageModule } = NativeModules;

interface AppUsage {
  packageName: string;
  appName: string;
  totalTimeInForeground: number;
  lastTimeUsed: number;
  isSocialMedia: boolean;
}

interface UsageStatsResult {
  apps: AppUsage[];
  totalSocialMediaTime: number;
}

export type TimeRange = 'day' | 'week' | 'month';

export const useWellbeing = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [usageStats, setUsageStats] = useState<AppUsage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const { db } = useDatabase();

  const checkPermission = async () => {
    if (Platform.OS !== 'android') {
      setError('Este recurso só está disponível no Android');
      return false;
    }

    try {
      const hasPermission = await AppUsageModule.checkUsagePermission();
      setHasPermission(hasPermission);
      return hasPermission;
    } catch (err) {
      setError('Erro ao verificar permissão');
      return false;
    }
  };

  const requestPermission = async () => {
    if (Platform.OS !== 'android') {
      setError('Este recurso só está disponível no Android');
      return false;
    }

    try {
      AppUsageModule.openUsageAccessSettings();
      return true;
    } catch (err) {
      setError('Erro ao solicitar permissão');
      return false;
    }
  };

  const saveToSQLite = async (apps: AppUsage[]) => {
    if (!db) return;

    try {
      // Limpar dados antigos
      await db.transaction(tx => {
        tx.executeSql('DELETE FROM app_usage');
      });

      // Salvar os 10 apps mais usados
      const topApps = apps
        .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
        .slice(0, 10);

      for (const app of topApps) {
        await db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO app_usage (package_name, app_name, total_time, last_used, is_social_media) VALUES (?, ?, ?, ?, ?)',
            [
              app.packageName,
              app.appName,
              app.totalTimeInForeground,
              app.lastTimeUsed,
              app.isSocialMedia ? 1 : 0,
            ]
          );
        });
      }

      console.log('Dados salvos no SQLite:', topApps.length, 'apps');
    } catch (err) {
      console.error('Erro ao salvar no SQLite:', err);
    }
  };

  const syncToServer = async () => {
    setSyncing(true);
    try {
      const usageDataService = UsageDataService.getInstance();
      const success = await usageDataService.syncUsageData();
      
      if (success) {
        console.log('Dados sincronizados com sucesso');
        // Opcional: marcar como sincronizado
        await usageDataService.markAsSynced();
      } else {
        console.log('Falha na sincronização');
      }
      
      return success;
    } catch (err) {
      console.error('Erro durante a sincronização:', err);
      return false;
    } finally {
      setSyncing(false);
    }
  };

  const fetchUsageStats = async (range: TimeRange = 'day') => {
    if (Platform.OS !== 'android') {
      setError('Este recurso só está disponível no Android');
      return;
    }

    if (!hasPermission) {
      setError('Permissão não concedida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result: UsageStatsResult = await AppUsageModule.getUsageStats();
      
      // Ordenar por tempo de uso e pegar os 10 mais usados
      const topApps = result.apps
        .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
        .slice(0, 10);

      setUsageStats(topApps);

      // Salvar no SQLite
      await saveToSQLite(result.apps);

      // Sincronizar com o servidor (opcional - pode ser feito em background)
      // await syncToServer();

    } catch (err) {
      setError('Erro ao buscar estatísticas de uso');
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    hasPermission,
    usageStats,
    loading,
    error,
    syncing,
    checkPermission,
    requestPermission,
    fetchUsageStats,
    syncToServer,
  };
}; 