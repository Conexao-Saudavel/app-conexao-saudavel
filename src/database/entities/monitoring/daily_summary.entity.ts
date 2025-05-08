import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('daily_summary')
export class DailySummary {
  @PrimaryColumn('text')
  @Index('idx_daily_summary_date_range')
  date: string;

  @Column('integer', { nullable: true })
  total_usage: number;

  @Column('text', { nullable: true })
  app_breakdown: string;

  @Column('real', { nullable: true })
  goal_completion: number;

  @Column('text', { nullable: true })
  most_used_app: string;

  @Column('integer', { nullable: true })
  streak_count: number;

  @Column('integer')
  calculated_at: number;

  @Column('integer', { default: 0 })
  synced: number;
}