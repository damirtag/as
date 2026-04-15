import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User, RefreshTokens, Quote, Comment, Reaction } from "@as/contracts";

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "12345678",
  database: process.env.DB_NAME ?? "asdb",

  synchronize: false,
  logging: true,
  migrationsRun: false,

  entities: [User, RefreshTokens, Quote, Comment, Reaction],
  migrations: ["dist/migrations/*{.ts,.js}"],
});
