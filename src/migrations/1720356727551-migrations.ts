import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1720356727551 implements MigrationInterface {
    name = 'Migrations1720356727551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`account\` varchar(255) NOT NULL COMMENT '로그인 계정명', \`email\` varchar(100) NOT NULL COMMENT '이메일', \`password\` varchar(256) NOT NULL COMMENT '비밀번호', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
