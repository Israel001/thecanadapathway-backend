import { ConfigService } from '@nestjs/config';
import { PaymentInfo, PreOrderEmailDto } from './app.dto';
import { JwtService } from '@nestjs/jwt';
import { Student } from './entities/students.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { SharedService } from './modules/shared/shared.service';
export declare class AppService {
    private readonly configService;
    private readonly jwtService;
    private readonly sharedService;
    private readonly studentRepository;
    private readonly paymentRepository;
    private readonly flutterwaveConfig;
    constructor(configService: ConfigService, jwtService: JwtService, sharedService: SharedService, studentRepository: Repository<Student>, paymentRepository: Repository<Payment>);
    login(accessCode: string): Promise<{
        accessToken: string;
        user: Student;
    }>;
    verifyTransaction(transactionId: number, { email, amount }: PaymentInfo): Promise<{
        success: boolean;
        message: string;
    }>;
    sendPreOrderEmail(details: PreOrderEmailDto): Promise<boolean>;
}
