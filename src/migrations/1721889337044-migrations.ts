import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1721889337044 implements MigrationInterface {
    name = 'Migrations1721889337044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`youtubeInfos\` ADD \`timestampPoint\` int NOT NULL COMMENT '타임스탬프 생성에 필요한 포인트'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`youtubeInfos\` DROP COLUMN \`timestampPoint\``);
    }

}
