"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1726655101419 = void 0;
class InitialMigration1726655101419 {
    constructor() {
        this.name = 'InitialMigration1726655101419';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`students\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`access_code\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`suspended\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`transaction_id\` int NOT NULL, \`reference\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`metadata\` longtext NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`students\``);
    }
}
exports.InitialMigration1726655101419 = InitialMigration1726655101419;
//# sourceMappingURL=1726655101419-InitialMigration.js.map