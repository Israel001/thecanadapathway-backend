"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCorrelationIdInterceptor = void 0;
class AddCorrelationIdInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request && request.res) {
            const correlationId = request.id;
            request.res.header('x-correlation-id', correlationId);
        }
        return next.handle();
    }
}
exports.AddCorrelationIdInterceptor = AddCorrelationIdInterceptor;
//# sourceMappingURL=add-correlation-id-interceptor.js.map