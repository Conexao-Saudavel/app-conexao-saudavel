import { Repository, LessThan, MoreThan } from 'typeorm';
import { PasswordResetToken } from '../entities/PasswordResetToken';
import AppDataSource from '../data-source';

export class PasswordResetTokenRepository {
  private repository: Repository<PasswordResetToken>;

  constructor() {
    this.repository = AppDataSource.getRepository(PasswordResetToken);
  }

  /**
   * Encontra um token pelo seu valor
   */
  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.repository.findOne({
      where: { token },
      relations: ['user']
    });
  }

  /**
   * Encontra tokens de um usuário específico
   */
  async findByUserId(userId: string): Promise<PasswordResetToken[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Cria um novo token de redefinição de senha
   */
  async create(tokenData: Partial<PasswordResetToken>): Promise<PasswordResetToken> {
    const token = this.repository.create(tokenData);
    return this.repository.save(token);
  }

  /**
   * Marca um token como usado
   */
  async markAsUsed(token: string): Promise<void> {
    await this.repository.update(
      { token },
      { used: true }
    );
  }

  /**
   * Marca todos os tokens de um usuário como usados
   */
  async invalidateUserTokens(userId: string): Promise<void> {
    await this.repository.update(
      { userId, used: false },
      { used: true }
    );
  }

  /**
   * Verifica se um token é válido (existe, não expirou e não foi usado)
   */
  async isTokenValid(token: string): Promise<boolean> {
    const tokenRecord = await this.findByToken(token);
    
    if (!tokenRecord) {
      return false;
    }
    
    const now = new Date();
    return !tokenRecord.used && tokenRecord.expiresAt > now;
  }

  /**
   * Remove tokens expirados do banco de dados
   */
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.repository.delete({
      expiresAt: LessThan(now)
    });
  }

  /**
   * Conta quantos tokens um usuário gerou nas últimas horas
   * Útil para limitar solicitações de redefinição de senha
   */
  async countRecentTokens(userId: string, hours = 24): Promise<number> {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    const count = await this.repository.count({
      where: {
        userId,
        createdAt: MoreThan(cutoff)
      }
    });
    
    return count;
  }
}