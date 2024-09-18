import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { IAdminAuthContext } from 'src/types';
declare const AdminJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    protected readonly configService: ConfigService;
    constructor(configService: ConfigService);
    validate(payload: IAdminAuthContext): Promise<IAdminAuthContext>;
}
export {};
