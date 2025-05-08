import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1684872321000 implements MigrationInterface {
    name = 'CreateInitialTables1684872321000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar índices adicionais
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_app_usage_pending_sync ON app_usage(synced, created_at)
            WHERE synced = 0
        `);

        // Trigger para calcular duração automaticamente
        await queryRunner.query(`
            CREATE TRIGGER IF NOT EXISTS calculate_duration
            AFTER UPDATE OF end_time ON app_usage
            FOR EACH ROW
            WHEN NEW.end_time IS NOT NULL AND NEW.duration IS NULL
            BEGIN
                UPDATE app_usage
                SET duration = (NEW.end_time - NEW.start_time) / 1000
                WHERE id = NEW.id;
            END;
        `);

        // Trigger para atualizar last_modified em user_settings
        await queryRunner.query(`
            CREATE TRIGGER IF NOT EXISTS update_settings_timestamp
            BEFORE UPDATE ON user_settings
            BEGIN
                UPDATE user_settings
                SET last_modified = (strftime('%s', 'now') * 1000)
                WHERE id = OLD.id;
            END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover triggers
        await queryRunner.query(`DROP TRIGGER IF EXISTS calculate_duration`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_settings_timestamp`);
        
        // Remover índices
        await queryRunner.query(`DROP INDEX IF EXISTS idx_app_usage_pending_sync`);
    }
}