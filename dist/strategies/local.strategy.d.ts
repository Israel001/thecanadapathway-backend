import { Strategy } from 'passport-local';
import { AppService } from 'src/app.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly service;
    constructor(service: AppService);
    validate(accessCode: string): Promise<{}>;
}
export {};
