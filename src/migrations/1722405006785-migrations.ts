import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722405006785 implements MigrationInterface {
    name = 'Migrations1722405006785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`path\` varchar(255) NOT NULL COMMENT 'scheme url 맨뒤에 붙을 path'`);
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`path\``);
    }

}
