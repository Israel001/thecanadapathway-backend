import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { FlutterwaveConfig } from './config/types/flutterwave.config';
import { ConfigService } from '@nestjs/config';
import { PaymentInfo } from './app.dto';
import axios from 'axios';
import util from 'util';
import { JwtService } from '@nestjs/jwt';
import { Student } from './entities/students.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';

@Injectable()
export class AppService {
  private readonly flutterwaveConfig: FlutterwaveConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    this.flutterwaveConfig =
      this.configService.get<FlutterwaveConfig>('flutterwaveConfig');
  }

  async login(user: Student) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }

  async validateUser(accessCode: string): Promise<Student> {
    const user = await this.studentRepository.findOne({
      where: { accessCode },
    });
    if (!user) throw new NotFoundException('Access code not found');
    return user;
  }

  async verifyTransaction(
    transactionId: number,
    { email, amount }: PaymentInfo,
  ) {
    const response = await axios
      .get(
        `${this.flutterwaveConfig.baseUrl}/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.flutterwaveConfig.secretKey}`,
          },
        },
      )
      .catch((error) => {
        console.log(util.inspect(error.response, true, null, false));
        throw error;
      });
    const data = response.data.data;
    console.log(data);
    if (
      data.status !== 'successful' ||
      data.amount !== amount ||
      data.customer.email !== email
    ) {
      throw new NotAcceptableException('Transaction is not valid');
    }
    const accessCode = (data.tx_ref as string).toUpperCase();

    const paymentExists = await this.paymentRepository.findOne({
      where: { reference: accessCode },
    });
    if (paymentExists) throw new ConflictException('Duplicate payment');
    const paymentModel = this.paymentRepository.create({
      transactionId: data.id,
      reference: accessCode,
      email: data.customer.email,
      metadata: JSON.stringify(data),
    });
    await this.paymentRepository.save(paymentModel);

    const studentModel = this.studentRepository.create({
      email: data.customer.email,
      accessCode,
      suspended: false,
    });
    const studentExists = await this.studentRepository.findOne({
      where: { email: data.customer.email },
    });
    if (studentExists) studentModel.id = studentExists.id;
    await this.studentRepository.save(studentModel);

    // send access code to student email

    return {
      success: true,
      message: 'Transaction verified successfully',
    };
  }
}
