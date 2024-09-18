"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfiguration = void 0;
const corsConfiguration = {
    origin: '*',
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
exports.corsConfiguration = corsConfiguration;
//# sourceMappingURL=cors-configuration.js.map