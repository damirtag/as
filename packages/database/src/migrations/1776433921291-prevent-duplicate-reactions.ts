import { MigrationInterface, QueryRunner } from "typeorm";

export class PreventDuplicateReactions1776433921291
  implements MigrationInterface
{
  name = "PreventDuplicateReactions1776433921291";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "reactions" duplicate
      USING "reactions" original
      WHERE duplicate."userId" = original."userId"
        AND duplicate."quoteId" = original."quoteId"
        AND duplicate."type" = original."type"
        AND duplicate."commentId" IS NULL
        AND original."commentId" IS NULL
        AND duplicate."id" > original."id"
    `);

    await queryRunner.query(`
      DELETE FROM "reactions" duplicate
      USING "reactions" original
      WHERE duplicate."userId" = original."userId"
        AND duplicate."commentId" = original."commentId"
        AND duplicate."type" = original."type"
        AND duplicate."commentId" IS NOT NULL
        AND original."commentId" IS NOT NULL
        AND duplicate."id" > original."id"
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_reactions_user_quote_type"
      ON "reactions" ("userId", "quoteId", "type")
      WHERE "commentId" IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_reactions_user_comment_type"
      ON "reactions" ("userId", "commentId", "type")
      WHERE "commentId" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_reactions_user_comment_type"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_reactions_user_quote_type"`);
  }
}
