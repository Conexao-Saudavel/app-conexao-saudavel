import { Repository, Between, In } from 'typeorm';
import { QuestionnaireResponses } from '../entities/questionnaire_responses.entity';
import AppDataSource from '../data-source';

export class QuestionnaireResponsesRepository {
  private repository: Repository<QuestionnaireResponses>;

  constructor() {
    this.repository = AppDataSource.getRepository(QuestionnaireResponses);
  }

  /**
   * Encontra todas as respostas de questionários
   */
  async findAll(): Promise<QuestionnaireResponses[]> {
    return this.repository.find({
      order: { timestamp: 'DESC' }
    });
  }

  /**
   * Encontra uma resposta de questionário pelo ID
   */
  async findById(id: string): Promise<QuestionnaireResponses | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Encontra respostas por ID do questionário
   */
  async findByQuestionnaireId(questionnaireId: string): Promise<QuestionnaireResponses[]> {
    return this.repository.find({
      where: { questionnaire_id: questionnaireId },
      order: { timestamp: 'DESC' }
    });
  }

  /**
   * Encontra respostas em um intervalo de tempo
   */
  async findByTimeRange(startTime: number, endTime: number): Promise<QuestionnaireResponses[]> {
    return this.repository.find({
      where: {
        timestamp: Between(startTime, endTime)
      },
      order: { timestamp: 'ASC' }
    });
  }

  /**
   * Encontra respostas pendentes de sincronização
   */
  async findPendingSync(): Promise<QuestionnaireResponses[]> {
    return this.repository.find({
      where: { synced: 0 },
      order: { created_at: 'ASC' }
    });
  }

  /**
   * Cria uma nova resposta de questionário
   */
  async create(response: Partial<QuestionnaireResponses>): Promise<QuestionnaireResponses> {
    const newResponse = this.repository.create({
      ...response,
      timestamp: response.timestamp || Date.now(),
      created_at: Date.now()
    });
    
    return this.repository.save(newResponse);
  }

  /**
   * Marca respostas como sincronizadas
   */
  async markAsSynced(ids: string[] | number[]): Promise<void> {
    await this.repository.update(
      { id: In(ids as string[]) },
      { synced: 1 }
    );
  }

  /**
   * Obtém a resposta mais recente para um questionário específico
   */
  async getLatestResponse(questionnaireId: string): Promise<QuestionnaireResponses | null> {
    return this.repository.findOne({
      where: { questionnaire_id: questionnaireId },
      order: { timestamp: 'DESC' }
    });
  }

  /**
   * Obtém o histórico de pontuações para um questionário
   */
  async getScoreHistory(questionnaireId: string, limit = 10): Promise<any[]> {
    return this.repository
      .createQueryBuilder('response')
      .select('response.timestamp', 'timestamp')
      .addSelect('response.score', 'score')
      .where('response.questionnaire_id = :questionnaireId', { questionnaireId })
      .orderBy('response.timestamp', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /**
   * Calcula a pontuação média para um questionário
   */
  async getAverageScore(questionnaireId: string): Promise<number | null> {
    const result = await this.repository
      .createQueryBuilder('response')
      .select('AVG(response.score)', 'average')
      .where('response.questionnaire_id = :questionnaireId', { questionnaireId })
      .andWhere('response.score IS NOT NULL')
      .getRawOne();
    
    return result?.average ? parseFloat(result.average) : null;
  }
}