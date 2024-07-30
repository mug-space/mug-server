import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722345759474 implements MigrationInterface {
    name = 'Migrations1722345759474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`schemes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL COMMENT 'users ID', \`type\` varchar(255) NOT NULL COMMENT 'scheme url type', \`url\` varchar(255) NOT NULL COMMENT 'origin url', \`ios\` varchar(255) NOT NULL COMMENT 'ios, web url', \`android\` varchar(255) NOT NULL COMMENT 'anroid', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`schemes\``);
    }

}
