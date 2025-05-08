import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index() // Adiciona um índice para buscas rápidas pelo token
  token: string;

  @Column()
  expiresAt: Date;

  @Column() // Adiciona coluna explícita para o ID do usuário
  userId: string;

  @ManyToOne(() => User, (user) => user.resetTokens)
  @JoinColumn({ name: 'userId' }) // Especifica o nome da coluna para o relacionamento
  user: User;

  @Column({ default: false })
  used: boolean; // Indica se o token já foi usado

  @CreateDateColumn()
  createdAt: Date; // Registra quando o token foi criado
  
  // Métodos de utilidade que podem ser úteis
  
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
  
  isValid(): boolean {
    return !this.used && !this.isExpired();
  }
}