import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1693342708218 implements MigrationInterface {
  name = 'InitialMigration1693342708218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payments\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`transaction_id\` int NOT NULL, \`reference\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`metadata\` longtext NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`students\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`access_code\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`suspended\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`admin_users\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_dcd0c8a4b10af9c986e510b9ec\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_dcd0c8a4b10af9c986e510b9ec\` ON \`admin_users\``,
    );
    await queryRunner.query(`DROP TABLE \`admin_users\``);
    await queryRunner.query(`DROP TABLE \`students\``);
    await queryRunner.query(`DROP TABLE \`payments\``);
  }
}
