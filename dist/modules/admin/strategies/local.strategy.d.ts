import { Strategy } from 'passport-local';
import { AdminService } from '../admin.service';
declare const AdminLocalStrategy_base: new (...args: any[]) => Strategy;
export declare class AdminLocalStrategy extends AdminLocalStrategy_base {
    private readonly service;
    constructor(service: AdminService);
    validate(email: string, password: string): Promise<import("../admin.entities").AdminUser>;
}
export {};
