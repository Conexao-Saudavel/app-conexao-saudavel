import { NativeModules, Platform } from 'react-native';

const { AppUsageModule } = NativeModules;

// Define types for the data returned by getUsageStats
export interface AppUsageData {
  packageName: string;
  appName: string;
  totalTimeInForeground: number;
  lastTimeUsed: number;
  isSocialMedia: boolean;
}

export interface UsageStatsResult {
  apps: AppUsageData[];
  totalSocialMediaTime: number;
}

// Function to get app usage stats
export const getAppUsageStats = (): Promise<UsageStatsResult> => {
  if (Platform.OS !== 'android') {
    return Promise.reject(new Error('Este recurso só está disponível no Android'));
  }

  return new Promise((resolve, reject) => {
    AppUsageModule.getUsageStats()
      .then((data: UsageStatsResult) => resolve(data))
      .catch((error: Error) => reject(error));
  });
};

// Function to open usage settings
export const openUsageSettings = (): void => {
  if (Platform.OS === 'android') {
    AppUsageModule.openUsageAccessSettings();
  }
};

// Function to check if usage permission is granted
export const checkUsagePermission = (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    AppUsageModule.checkUsagePermission()
      .then((hasPermission: boolean) => {
        resolve(hasPermission);
      })
      .catch((error: Error) => reject(error));
  });
}; 