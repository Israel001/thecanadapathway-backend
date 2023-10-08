import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationTemplateEntity1694206850159
  implements MigrationInterface
{
  name = 'AddNotificationTemplateEntity1694206850159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification_templates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`body\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`notification_templates\``);
  }
}
