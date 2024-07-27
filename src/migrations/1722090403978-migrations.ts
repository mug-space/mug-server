import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722090403978 implements MigrationInterface {
    name = 'Migrations1722090403978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneCode\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneCode\` varchar(30) NULL COMMENT '전화번호인증번호 6자리 - 인증받을 폰번호'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneCode\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneCode\` varchar(6) NULL COMMENT '전화번호인증번호 6자리'`);
    }

}
