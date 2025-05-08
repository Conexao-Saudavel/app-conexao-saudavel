import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_settings')
export class UserSettings {
  @PrimaryColumn('text', { default: 'current' })
  id: string;

  @Column('integer', { nullable: true })
  daily_limit: number;

  @Column('text', { nullable: true })
  app_limits: string;

  @Column('integer', { default: 1 })
  notifications_enabled: number;

  @Column('integer', { default: 60 })
  sync_frequency: number;

  @Column('integer')
  last_modified: number;

  @Column('integer', { default: 0 })
  synced: number;

  @Column('integer', { default: 0 })
  server_version: number;
}