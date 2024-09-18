import { AdminService } from './admin.service';
import * as dtos from './dto';
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    login(_body: dtos.AdminLoginDTO, req: any): Promise<{
        accessToken: string;
        user: import("./admin.entities").AdminUser;
    }>;
    createUser(body: dtos.AdminUserDto): Promise<void>;
    giveAccessCode(body: {
        email: string;
        name: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getActiveStudents(): Promise<import("../../entities/students.entity").Student[]>;
    getSuspendedStudents(): Promise<import("../../entities/students.entity").Student[]>;
    suspendUser(userId: number): Promise<import("../../entities/students.entity").Student>;
    activateUser(userId: number): Promise<import("../../entities/students.entity").Student>;
}
