"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cors_configuration_1 = require("./config/cors-configuration");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: cors_configuration_1.corsConfiguration,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.enableShutdownHooks();
    await app.listen(process.env.PORT || 8080, () => {
        new common_1.Logger().log(`API is started on PORT ${process.env.PORT || 8080}...`);
    });
}
if (!process.env.VERCEL) {
    bootstrap();
}
//# sourceMappingURL=main.js.map