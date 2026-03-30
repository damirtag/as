import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1774869368564 implements MigrationInterface {
    name = 'Migrations1774869368564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_f3e1d278edeb2c19a2ddad83f8e"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_2531556df97bc8b20f462ecc84e"`);
        await queryRunner.query(`ALTER TABLE "reactions" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reactions" ALTER COLUMN "quoteId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e4abf812c132f9f8fc63ec342be"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "quoteId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quotes" DROP CONSTRAINT "FK_8bad8bd49d1dd6954b46366349c"`);
        await queryRunner.query(`ALTER TABLE "quotes" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_f3e1d278edeb2c19a2ddad83f8e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_2531556df97bc8b20f462ecc84e" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e4abf812c132f9f8fc63ec342be" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD CONSTRAINT "FK_8bad8bd49d1dd6954b46366349c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "quotes" DROP CONSTRAINT "FK_8bad8bd49d1dd6954b46366349c"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e4abf812c132f9f8fc63ec342be"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_2531556df97bc8b20f462ecc84e"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_f3e1d278edeb2c19a2ddad83f8e"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quotes" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD CONSTRAINT "FK_8bad8bd49d1dd6954b46366349c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "quoteId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e4abf812c132f9f8fc63ec342be" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ALTER COLUMN "quoteId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reactions" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_2531556df97bc8b20f462ecc84e" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_f3e1d278edeb2c19a2ddad83f8e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
