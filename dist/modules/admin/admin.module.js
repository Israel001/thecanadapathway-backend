"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const admin_controller_1 = require("./admin.controller");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entities_1 = require("./admin.entities");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const configuration_1 = require("../../config/configuration");
const jwt_1 = require("@nestjs/jwt");
const students_entity_1 = require("../../entities/students.entity");
const shared_module_1 = require("../shared/shared.module");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entities_1.AdminUser, students_entity_1.Student]),
            passport_1.PassportModule,
            config_1.ConfigModule.forRoot({ load: [configuration_1.JwtAuthConfiguration] }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule.forRoot({ load: [configuration_1.JwtAuthConfiguration] })],
                useFactory: (configService) => ({
                    secret: configService.get('jwtAuthConfig').secretKey,
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
            shared_module_1.SharedModule,
        ],
        providers: [admin_service_1.AdminService, local_strategy_1.AdminLocalStrategy, jwt_strategy_1.AdminJwtStrategy],
        controllers: [admin_controller_1.AdminController],
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map