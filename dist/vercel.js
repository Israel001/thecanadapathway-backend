"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const aws_serverless_express_1 = require("aws-serverless-express");
let cachedServer;
async function bootstrapServer() {
    if (!cachedServer) {
        const expressApp = (0, express_1.default)();
        const nestApp = core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        (await nestApp).init();
        cachedServer = (0, aws_serverless_express_1.createServer)(expressApp);
    }
    return cachedServer;
}
const handler = async (event, context, callback) => {
    cachedServer = await bootstrapServer();
    return (0, aws_serverless_express_1.proxy)(cachedServer, event, context, 'PROMISE').promise;
};
exports.handler = handler;
//# sourceMappingURL=vercel.js.map