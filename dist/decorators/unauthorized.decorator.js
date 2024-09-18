"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowUnauthorizedRequest = void 0;
const common_1 = require("@nestjs/common");
const AllowUnauthorizedRequest = () => (0, common_1.SetMetadata)('allowUnauthorizedRequest', true);
exports.AllowUnauthorizedRequest = AllowUnauthorizedRequest;
//# sourceMappingURL=unauthorized.decorator.js.map