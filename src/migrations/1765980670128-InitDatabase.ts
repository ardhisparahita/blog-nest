import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1765980670128 implements MigrationInterface {
    name = 'InitDatabase1765980670128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`profile\` (\`id\` varchar(36) NOT NULL, \`age\` int NOT NULL, \`bio\` text NOT NULL, \`userId\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_a24972ebd73b106250713dcddd\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_a24972ebd73b106250713dcddd9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_a24972ebd73b106250713dcddd9\``);
        await queryRunner.query(`DROP INDEX \`REL_a24972ebd73b106250713dcddd\` ON \`profile\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
    }

}
