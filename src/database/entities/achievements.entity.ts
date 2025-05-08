import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  achievement_type: string;

  @Column('integer')
  timestamp: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  metadata: string;

  @Column('integer', { default: 0 })
  synced: number;

  @CreateDateColumn({ type: 'integer', name: 'created_at' })
  created_at: number;
}