import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1766141223663 implements MigrationInterface {
    name = 'InitDatabase1766141223663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
