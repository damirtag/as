import { DataSource } from "typeorm";
import { User, RefreshTokens, Quote, Comment, Reaction } from "@as/contracts";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "12345678",
  database: process.env.DB_NAME || "asdb",
  synchronize: false,
  migrationsRun: false,
  logging: true,
  entities: [User, RefreshTokens, Quote, Comment, Reaction],
  migrations: ["./migrations/*.{ts,js}"],
});
