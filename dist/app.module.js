"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const request_logger_middleware_1 = require("./middleware/request-logger-middleware");
const nestjs_1 = require("@automapper/nestjs");
const classes_1 = require("@automapper/classes");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const app_controller_1 = require("./app.controller");
const add_correlation_id_interceptor_1 = require("./lib/add-correlation-id-interceptor");
const core_1 = require("@nestjs/core");
const timeout_interceptor_1 = require("./lib/timeout.interceptor");
const app_service_1 = require("./app.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const admin_module_1 = require("./modules/admin/admin.module");
const ormconfig = __importStar(require("./config/ormconfig"));
const students_entity_1 = require("./entities/students.entity");
const payments_entity_1 = require("./entities/payments.entity");
const jwt_strategy_1 = require("./modules/admin/strategies/jwt.strategy");
const shared_module_1 = require("./modules/shared/shared.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            nestjs_1.AutomapperModule.forRoot({
                options: [{ name: 'classMapper', pluginInitializer: classes_1.classes }],
                singular: true,
            }),
            config_1.ConfigModule.forRoot({
                load: [configuration_1.FlutterwaveConfiguration, configuration_1.JwtAuthConfiguration],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule.forRoot({ load: [configuration_1.JwtAuthConfiguration] })],
                useFactory: (configService) => ({
                    secret: configService.get('jwtAuthConfig').secretKey,
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forRoot(ormconfig),
            typeorm_1.TypeOrmModule.forFeature([students_entity_1.Student, payments_entity_1.Payment]),
            shared_module_1.SharedModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: add_correlation_id_interceptor_1.AddCorrelationIdInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: timeout_interceptor_1.TimeoutInterceptor,
            },
            app_service_1.AppService,
            jwt_strategy_1.AdminJwtStrategy,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map