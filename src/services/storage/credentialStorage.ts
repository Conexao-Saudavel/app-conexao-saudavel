import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedCredentials {
  email: string;
  password: string;
  remember: boolean;
}

class CredentialStorage {
  private static readonly CREDENTIALS_KEY = 'saved_credentials';

  // Salvar credenciais
  static async saveCredentials(email: string, password: string, remember: boolean): Promise<void> {
    try {
      if (remember) {
        const credentials: SavedCredentials = {
          email,
          password,
          remember: true
        };
        await AsyncStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(credentials));
        console.log('Credenciais salvas com sucesso');
      } else {
        // Se não lembrar, remover credenciais salvas
        await this.clearCredentials();
      }
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
    }
  }

  // Carregar credenciais salvas
  static async loadCredentials(): Promise<SavedCredentials | null> {
    try {
      const savedCredentials = await AsyncStorage.getItem(this.CREDENTIALS_KEY);
      if (savedCredentials) {
        const credentials: SavedCredentials = JSON.parse(savedCredentials);
        console.log('Credenciais carregadas:', credentials.email);
        return credentials;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
      return null;
    }
  }

  // Limpar credenciais salvas
  static async clearCredentials(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CREDENTIALS_KEY);
      console.log('Credenciais removidas');
    } catch (error) {
      console.error('Erro ao limpar credenciais:', error);
    }
  }

  // Verificar se há credenciais salvas
  static async hasSavedCredentials(): Promise<boolean> {
    try {
      const credentials = await this.loadCredentials();
      return credentials !== null && credentials.remember;
    } catch (error) {
      console.error('Erro ao verificar credenciais salvas:', error);
      return false;
    }
  }
}

export default CredentialStorage; 