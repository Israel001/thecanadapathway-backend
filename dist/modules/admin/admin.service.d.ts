import { JwtService } from '@nestjs/jwt';
import { AdminUser } from './admin.entities';
import { Repository } from 'typeorm';
import { Student } from 'src/entities/students.entity';
import { AdminUserDto } from './dto';
import { SharedService } from '../shared/shared.service';
export declare class AdminService {
    private readonly jwtService;
    private readonly adminUserRepository;
    private readonly studentRepository;
    private readonly sharedService;
    constructor(jwtService: JwtService, adminUserRepository: Repository<AdminUser>, studentRepository: Repository<Student>, sharedService: SharedService);
    findUserByEmail(email: string): Promise<AdminUser>;
    giveAccessCode(email: string, name: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getActiveStudents(): Promise<Student[]>;
    getSuspendedStudents(): Promise<Student[]>;
    suspendUser(userId: number): Promise<Student>;
    activateUser(userId: number): Promise<Student>;
    createUser(user: AdminUserDto): Promise<void>;
    validateUser(email: string, password: string): Promise<AdminUser>;
    login(user: AdminUser): Promise<{
        accessToken: string;
        user: AdminUser;
    }>;
}
