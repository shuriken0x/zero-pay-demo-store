import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1779744583796 implements MigrationInterface {
    name = 'Initial1779744583796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "top_up" ("id" uuid NOT NULL DEFAULT uuidv4(), "amount" numeric(19,4) NOT NULL, "meta" jsonb NOT NULL, "paid" boolean NOT NULL, "expired" boolean NOT NULL, "userId" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6753d037475a5a54c6dc7b910c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'normal')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" BIGSERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL, "banned" boolean NOT NULL, "balance" numeric(19,4) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "processed_webhook" ("id" BIGSERIAL NOT NULL, "webhookId" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_7c957ee64636666ea6ed3fe6c7e" UNIQUE ("webhookId"), CONSTRAINT "PK_3c09811c884c7d67b3a11f391b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "top_up" ADD CONSTRAINT "FK_bfa686d5e658d1686dcef4b7e93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "top_up" DROP CONSTRAINT "FK_bfa686d5e658d1686dcef4b7e93"`);
        await queryRunner.query(`DROP TABLE "processed_webhook"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "top_up"`);
    }

}
