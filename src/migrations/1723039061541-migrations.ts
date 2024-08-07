import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1723039061541 implements MigrationInterface {
    name = 'Migrations1723039061541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`og\` json NULL COMMENT 'open graph data'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`og\``);
    }

}
