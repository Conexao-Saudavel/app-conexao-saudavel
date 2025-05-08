import { Repository } from 'typeorm';
import { Institution } from '../entities/institution.entity';
import AppDataSource from '../data-source';

export class InstitutionRepository {
  private repository: Repository<Institution>;

  constructor() {
    this.repository = AppDataSource.getRepository(Institution);
  }

  async findAll(): Promise<Institution[]> {
    return this.repository.find({ relations: ['users'] });
  }

  async findById(id: string): Promise<Institution | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async findByEmail(email: string): Promise<Institution | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByCNPJ(cnpj: string): Promise<Institution | null> {
    return this.repository.findOne({ where: { cnpj } });
  }

  async create(data: Partial<Institution>): Promise<Institution> {
    const institution = this.repository.create(data);
    return this.repository.save(institution);
  }

  async update(id: string, data: Partial<Institution>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
