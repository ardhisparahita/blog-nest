import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1765960830760 implements MigrationInterface {
  name = 'InitDatabase1765960830760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
