import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQueryIndexes1776433921293 implements MigrationInterface {
  name = 'AddQueryIndexes1776433921293';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE INDEX "IDX_quotes_created_at" ON "quotes" ("createdAt" DESC)');
    await queryRunner.query('CREATE INDEX "IDX_quotes_user_created_at" ON "quotes" ("userId", "createdAt" DESC)');
    await queryRunner.query('CREATE INDEX "IDX_comments_quote_created_at" ON "comments" ("quoteId", "createdAt" DESC)');
    await queryRunner.query('CREATE INDEX "IDX_reactions_quote_created_at" ON "reactions" ("quoteId", "createdAt" DESC) WHERE "commentId" IS NULL');
    await queryRunner.query('CREATE INDEX "IDX_refresh_tokens_token" ON "refresh_tokens" ("token")');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_refresh_tokens_token"');
    await queryRunner.query('DROP INDEX "IDX_reactions_quote_created_at"');
    await queryRunner.query('DROP INDEX "IDX_comments_quote_created_at"');
    await queryRunner.query('DROP INDEX "IDX_quotes_user_created_at"');
    await queryRunner.query('DROP INDEX "IDX_quotes_created_at"');
  }
}