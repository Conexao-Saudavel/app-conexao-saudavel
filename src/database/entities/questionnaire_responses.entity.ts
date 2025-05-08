import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('questionnaire_responses')
export class QuestionnaireResponses {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  questionnaire_id: string;

  @Column('integer')
  timestamp: number;

  @Column('text')
  responses: string;

  @Column('integer', { nullable: true })
  score: number;

  @Column('integer', { default: 0 })
  @Index('idx_questionnaire_pending')
  synced: number;

  @CreateDateColumn({ type: 'integer', name: 'created_at' })
  created_at: number;
}