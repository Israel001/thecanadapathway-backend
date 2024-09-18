"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const path_1 = __importDefault(require("path"));
require('dotenv').config();
const config = {
    type: 'mysql',
    charset: 'utf8mb4',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        path_1.default.join(__dirname, '..', '{entities,modules}/**/*.{entity,entities}.{ts,js}'),
    ],
    keepConnectionAlive: true,
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    synchronize: false,
    extra: {
        connectionLimit: 50,
    },
    migrationsRun: false,
    logging: false,
    logger: 'advanced-console',
    migrations: [path_1.default.join(__dirname, '..', '/migrations/**/*{.ts,.js}')],
};
module.exports = config;
//# sourceMappingURL=ormconfig.js.map