import { Entity, Column, PrimaryColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('app_usage')
export class AppUsage {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  @Index('idx_app_usage_package')
  package_name: string;

  @Column('text', { nullable: true })
  app_name: string;

  @Column('integer')
  @Index('idx_app_usage_timerange')
  start_time: number;

  @Column('integer', { nullable: true })
  @Index('idx_app_usage_timerange')
  end_time: number;

  @Column('integer', { nullable: true })
  duration: number;

  @Column('text', { nullable: true })
  category: string;

  @Column('integer', { default: 1 })
  foreground: number;

  @Column('text', { nullable: true })
  metadata: string;

  @Column('integer', { default: 0 })
  @Index('idx_app_usage_synced')
  synced: number;

  @Column('text', { nullable: true })
  sync_id: string;

  @Column('integer', { default: 0 })
  sync_attempt_count: number;

  @Column('integer', { nullable: true })
  last_sync_attempt: number;

  @CreateDateColumn({ type: 'integer', name: 'created_at' })
  created_at: number;
}