"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpConfiguration = exports.JwtAuthConfiguration = exports.FlutterwaveConfiguration = void 0;
const config_1 = require("@nestjs/config");
exports.FlutterwaveConfiguration = (0, config_1.registerAs)('flutterwaveConfig', () => ({
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    baseUrl: process.env.FLUTTERWAVE_BASE_URL,
}));
exports.JwtAuthConfiguration = (0, config_1.registerAs)('jwtAuthConfig', () => ({
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
}));
exports.SmtpConfiguration = (0, config_1.registerAs)('smtpConfig', () => ({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
}));
//# sourceMappingURL=configuration.js.map