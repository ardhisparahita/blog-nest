import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1766066837130 implements MigrationInterface {
    name = 'InitDatabase1766066837130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profiles\` (\`id\` varchar(36) NOT NULL, \`age\` int NOT NULL, \`bio\` text NOT NULL, \`userId\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`articleId\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`image\` varchar(255) NULL, \`status\` enum ('PENDING', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'PENDING', \`categoryId\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article_tags\` (\`id\` varchar(36) NOT NULL, \`tagId\` varchar(255) NOT NULL, \`articleId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_d90243459a697eadb8ad56e909\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_b0011304ebfcb97f597eae6c31f\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_9cf383b5c60045a773ddced7f23\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_a9d18538b896fe2a6762e143bea\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_83a0534713c9e7f6bb2110c7bcc\` FOREIGN KEY (\`tagId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_acbc7f775fb5e3fe2627477b5f7\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_acbc7f775fb5e3fe2627477b5f7\``);
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_83a0534713c9e7f6bb2110c7bcc\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_a9d18538b896fe2a6762e143bea\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_9cf383b5c60045a773ddced7f23\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b0011304ebfcb97f597eae6c31f\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`DROP INDEX \`IDX_d90243459a697eadb8ad56e909\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`article_tags\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` ON \`profiles\``);
        await queryRunner.query(`DROP TABLE \`profiles\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}
