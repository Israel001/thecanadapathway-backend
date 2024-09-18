import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class RequestLoggerMiddleware implements NestMiddleware {
    private logger;
    use(req: Request, res: Response, next: Function): void;
}
