import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722089913950 implements MigrationInterface {
    name = 'Migrations1722089913950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(256) NULL COMMENT '전화번호'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneCode\` varchar(6) NULL COMMENT '전화번호인증번호 6자리'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneCode\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
    }

}
