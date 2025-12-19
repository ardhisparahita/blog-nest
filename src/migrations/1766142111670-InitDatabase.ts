import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1766142111670 implements MigrationInterface {
    name = 'InitDatabase1766142111670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
