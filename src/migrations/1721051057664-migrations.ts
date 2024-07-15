import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1721051057664 implements MigrationInterface {
    name = 'Migrations1721051057664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pointLogs\` CHANGE \`updatedAt\` \`type\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`enabled\` tinyint NOT NULL COMMENT '사용여부' DEFAULT 1, \`title\` varchar(255) NOT NULL COMMENT '제목', \`amount\` int NOT NULL COMMENT '가격', \`point\` int NOT NULL COMMENT '충전 포인트', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` CHANGE \`point\` \`point\` int NOT NULL COMMENT '사용 / 충전 포인트'`);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` ADD \`type\` varchar(255) NOT NULL COMMENT '사용, 충전 여부 타입'`);
        await queryRunner.query(`ALTER TABLE \`coupons\` DROP COLUMN \`uuid\``);
        await queryRunner.query(`ALTER TABLE \`coupons\` ADD \`uuid\` varchar(36) NOT NULL COMMENT 'Coupon uuid'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`coupons\` DROP COLUMN \`uuid\``);
        await queryRunner.query(`ALTER TABLE \`coupons\` ADD \`uuid\` varchar(255) NOT NULL COMMENT 'Coupon uuid'`);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` ADD \`type\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` CHANGE \`point\` \`point\` int NOT NULL COMMENT '사용 포인트'`);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`ALTER TABLE \`pointLogs\` CHANGE \`type\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

}
