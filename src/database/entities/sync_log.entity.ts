import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sync_log')
export class SyncLog {
  @PrimaryColumn('text')
  id: string;

  @Column('integer')
  timestamp: number;

  @Column('integer', { nullable: true })
  completion_time: number;

  @Column('text')
  status: string;

  @Column('integer', { default: 0 })
  records_sent: number;

  @Column('integer', { default: 0 })
  records_received: number;

  @Column('text', { nullable: true })
  error_message: string;

  @Column('text', { nullable: true })
  connection_type: string;

  @Column('text', { nullable: true })
  server_response: string;
}