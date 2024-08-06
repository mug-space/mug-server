import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722954285820 implements MigrationInterface {
    name = 'Migrations1722954285820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`expireType\` varchar(255) NOT NULL COMMENT 'scheme expire type' DEFAULT 'ONE_MONTH'`);
        await queryRunner.query(`ALTER TABLE \`schemes\` ADD \`expiredAt\` datetime NOT NULL COMMENT '만료일' DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`expiredAt\``);
        await queryRunner.query(`ALTER TABLE \`schemes\` DROP COLUMN \`expireType\``);
    }

}
