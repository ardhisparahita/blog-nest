import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1766113224755 implements MigrationInterface {
    name = 'InitDatabase1766113224755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_9cf383b5c60045a773ddced7f23\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_9cf383b5c60045a773ddced7f23\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_9cf383b5c60045a773ddced7f23\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_9cf383b5c60045a773ddced7f23\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
