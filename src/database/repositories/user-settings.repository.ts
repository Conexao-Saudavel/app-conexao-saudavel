import { Repository } from 'typeorm';
import { UserSettings } from '../entities/user_settings.entity';
import AppDataSource from '../data-source';

export class UserSettingsRepository {
  private repository: Repository<UserSettings>;
  private readonly DEFAULT_ID = 'current';

  constructor() {
    this.repository = AppDataSource.getRepository(UserSettings);
  }

  /**
   * Obtém as configurações atuais do usuário
   */
  async getCurrentSettings(): Promise<UserSettings | null> {
    const settings = await this.repository.findOneBy({ id: this.DEFAULT_ID });
    
    if (!settings) {
      // Criar configurações padrão se não existirem
      return this.createDefaultSettings();
    }
    
    return settings;
  }

  /**
   * Cria configurações padrão para o usuário
   */
  async createDefaultSettings(): Promise<UserSettings> {
    const defaultSettings = this.repository.create({
      id: this.DEFAULT_ID,
      daily_limit: 120, // 2 horas como limite padrão
      app_limits: JSON.stringify({}),
      notifications_enabled: 1,
      sync_frequency: 60,
      last_modified: Date.now(),
      synced: 0,
      server_version: 0
    });
    
    return this.repository.save(defaultSettings);
  }

  /**
   * Atualiza as configurações do usuário
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const currentSettings = await this.getCurrentSettings();
    
    // Combina as configurações atuais com as novas
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      // Não permitir a alteração do ID
      id: this.DEFAULT_ID,
      // Forçar a atualização do campo last_modified
      last_modified: Date.now(),
      // Marcar como não sincronizado
      synced: 0
    };
    
    await this.repository.save(updatedSettings);
    return this.getCurrentSettings() as Promise<UserSettings>;
  }

  /**
   * Define os limites de uso para aplicativos específicos
   */
  async setAppLimits(appLimits: Record<string, number>): Promise<UserSettings> {
    const currentSettings = await this.getCurrentSettings();
    
    // Combina limites existentes com os novos
    let existingLimits: Record<string, number> = {};
    try {
      existingLimits = JSON.parse(currentSettings?.app_limits || '{}');
    } catch (e) {
      existingLimits = {};
    }
    
    const updatedLimits = {
      ...existingLimits,
      ...appLimits
    };
    
    return this.updateSettings({
      app_limits: JSON.stringify(updatedLimits)
    });
  }

  /**
   * Obtém os limites de uso para aplicativos específicos
   */
  async getAppLimits(): Promise<Record<string, number>> {
    const settings = await this.getCurrentSettings();
    
    try {
      return JSON.parse(settings?.app_limits || '{}');
    } catch (e) {
      return {};
    }
  }

  /**
   * Marca as configurações como sincronizadas
   */
  async markAsSynced(serverVersion: number): Promise<void> {
    await this.repository.update(
      { id: this.DEFAULT_ID },
      { 
        synced: 1,
        server_version: serverVersion
      }
    );
  }

  /**
   * Verifica se as configurações precisam ser sincronizadas
   */
  async needsSync(): Promise<boolean> {
    const settings = await this.getCurrentSettings();
    return settings?.synced === 0;
  }
}