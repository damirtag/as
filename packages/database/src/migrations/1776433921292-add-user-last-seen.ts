import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLastSeen1776433921292 implements MigrationInterface {
  name = "AddUserLastSeen1776433921292";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastSeenAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastSeenAt"`);
  }
}
