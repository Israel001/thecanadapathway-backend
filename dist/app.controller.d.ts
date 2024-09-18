import { LoginDTO, PaymentInfo, PreOrderEmailDto } from './app.dto';
import { AppService } from './app.service';
export declare class AppController {
    private readonly service;
    constructor(service: AppService);
    getHello(): string;
    verifyPayment(transactionId: number, payment: PaymentInfo): Promise<{
        success: boolean;
        message: string;
    }>;
    login({ accessCode }: LoginDTO): Promise<{
        accessToken: string;
        user: import("./entities/students.entity").Student;
    }>;
    sendPreOrderEmail(preorderEmail: PreOrderEmailDto): Promise<boolean>;
    testToken(): boolean;
}
