import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1766026377511 implements MigrationInterface {
    name = 'InitDatabase1766026377511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`article_tag\` (\`id\` varchar(36) NOT NULL, \`tagId\` varchar(255) NOT NULL, \`articleId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`article\` CHANGE \`image\` \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`article_tag\` ADD CONSTRAINT \`FK_bbbd0832bdd107597b596d63f69\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_tag\` ADD CONSTRAINT \`FK_602d4921b27c9a7cb6c095992b4\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_tag\` DROP FOREIGN KEY \`FK_602d4921b27c9a7cb6c095992b4\``);
        await queryRunner.query(`ALTER TABLE \`article_tag\` DROP FOREIGN KEY \`FK_bbbd0832bdd107597b596d63f69\``);
        await queryRunner.query(`ALTER TABLE \`article\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP TABLE \`article_tag\``);
    }

}
