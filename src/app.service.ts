import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { FlutterwaveConfig } from './config/types/flutterwave.config';
import { ConfigService } from '@nestjs/config';
import { PaymentInfo, PreOrderEmailDto } from './app.dto';
import axios from 'axios';
import util from 'util';
import { JwtService } from '@nestjs/jwt';
import { Student } from './entities/students.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { SharedService } from './modules/shared/shared.service';
import otpGenerator from 'otp-generator';
import moment from 'moment';

@Injectable()
export class AppService {
  private readonly flutterwaveConfig: FlutterwaveConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    this.flutterwaveConfig =
      this.configService.get<FlutterwaveConfig>('flutterwaveConfig');
  }

  async login(accessCode: string) {
    const user = await this.studentRepository.findOne({
      where: { accessCode },
    });
    if (!user) throw new NotFoundException('Access code not found');
    if (user.suspended) throw new NotAcceptableException('User is suspended');
    delete user.createdAt;
    delete user.updatedAt;
    delete user.accessCode;
    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        name: user.fullName,
      }),
      user,
    };
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
      fullName: data.customer.name,
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
    await this.sharedService.sendEmail({
      templateCode: 'order_received',
      to: studentModel.email,
      subject: 'Welcome to the Academy',
      data: {
        fullName: studentModel.fullName,
        email: studentModel.email,
        accessCode: studentModel.accessCode,
      },
    });

    return {
      success: true,
      message: 'Transaction verified successfully',
    };
  }

  async sendPreOrderEmail(details: PreOrderEmailDto) {
    await this.sharedService.sendEmail({
      templateCode: 'pre_order',
      to: details.email,
      subject: 'Complete Your Canada Ultimate Guide Order',
      data: {
        fullName: details.fullName,
        orderNumber: otpGenerator.generate(8, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        }),
        date: moment().format('LL'),
        itemPrice: details.itemPrice,
        offerPrice: details.offerPrice,
        totalPrice: details.totalPrice,
      },
    });
    return true;
  }
}
