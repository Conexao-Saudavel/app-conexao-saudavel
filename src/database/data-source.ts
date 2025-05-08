import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Institution } from "./entities/institution.entity";
import { Report } from "./report/entities/report.entity";
import { PasswordResetToken } from "./entities/PasswordResetToken";
import { AppUsage } from "./entities/monitoring/app_usage.entity";
import { UserSettings } from "./entities/user_settings.entity";
import { SyncLog } from "./entities/sync_log.entity";
import { QuestionnaireResponses } from "./entities/questionnaire_responses.entity";
import { DailySummary } from "./entities/monitoring/daily_summary.entity";
import { Achievement } from "./entities/achievements.entity";

import { CreateInitialTables1684872321000 } from "./migrations/1684872321000-CreateInitialTables";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.NODE_ENV === "test" ? ":memory:" : "data/database.sqlite",
  entities: [
    User,
    Institution,
    Report,
    PasswordResetToken,
    AppUsage,
    UserSettings,
    SyncLog,
    QuestionnaireResponses,
    DailySummary,
    Achievement
  ],
  migrations: [
    CreateInitialTables1684872321000
  ],
  synchronize: process.env.NODE_ENV === "development", // Só usar em desenvolvimento
  logging: process.env.NODE_ENV === "development"
});

export default AppDataSource;