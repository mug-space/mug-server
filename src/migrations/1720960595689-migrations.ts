import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1720960595689 implements MigrationInterface {
    name = 'Migrations1720960595689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL, \`paymentKey\` varchar(255) NOT NULL COMMENT '결제 고유번호', \`orderId\` varchar(255) NOT NULL COMMENT '주문번호', \`orderName\` varchar(255) NOT NULL COMMENT '구매상품', \`method\` varchar(16) NOT NULL COMMENT '결제방법', \`userId\` int NOT NULL COMMENT 'users ID', \`totalAmount\` int NOT NULL COMMENT '결제 금액', \`paymentInfo\` json NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`coupons\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL COMMENT 'Coupon uuid', \`isUse\` tinyint NOT NULL COMMENT '사용여부' DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`youtubeTimestamps\` (\`id\` int NOT NULL AUTO_INCREMENT, \`youtubeId\` int NOT NULL COMMENT 'youtubes ID', \`status\` varchar(255) NOT NULL COMMENT '처리상태' DEFAULT 'NOT_COMPLETED', \`timestamps\` json NOT NULL COMMENT 'timestamp list', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inquiries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL COMMENT 'users ID', \`title\` varchar(100) NOT NULL COMMENT '제목', \`content\` text NOT NULL COMMENT '본문내용', \`answer\` text NULL COMMENT '답변내용', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`youtubeInfos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`youtubeId\` int NOT NULL COMMENT 'youtubes ID', \`captions\` json NOT NULL COMMENT '전체 자막 데이터', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`youtubes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`videoId\` varchar(255) NOT NULL COMMENT 'youtube video ID', \`userId\` int NOT NULL COMMENT 'users ID', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pointLogs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL COMMENT 'users ID', \`point\` int NOT NULL COMMENT '사용 포인트', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`uuid\` varchar(36) NOT NULL COMMENT 'user uuid'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`point\` int NOT NULL COMMENT '잔여 point' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`point\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`uuid\``);
        await queryRunner.query(`DROP TABLE \`pointLogs\``);
        await queryRunner.query(`DROP TABLE \`youtubes\``);
        await queryRunner.query(`DROP TABLE \`youtubeInfos\``);
        await queryRunner.query(`DROP TABLE \`inquiries\``);
        await queryRunner.query(`DROP TABLE \`youtubeTimestamps\``);
        await queryRunner.query(`DROP TABLE \`coupons\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
    }

}
