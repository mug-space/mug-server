import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722478791254 implements MigrationInterface {
    name = 'Migrations1722478791254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`ios\``);
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`android\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`android\` varchar(255) NOT NULL COMMENT 'anroid'`);
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`ios\` varchar(255) NOT NULL COMMENT 'ios, web url'`);
    }

}
