import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1766111997380 implements MigrationInterface {
    name = 'InitDatabase1766111997380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_acbc7f775fb5e3fe2627477b5f7\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_acbc7f775fb5e3fe2627477b5f7\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_acbc7f775fb5e3fe2627477b5f7\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_acbc7f775fb5e3fe2627477b5f7\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
