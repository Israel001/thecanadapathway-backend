import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoginDTO, PaymentInfo } from './app.dto';
import { AppService } from './app.service';
import { LocalAuthGuard } from './guards/local-auth-guard';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  getHello(): string {
    return 'Welcome to Backend API!!!';
  }

  @Post('/verify-transaction/:transactionId')
  verifyPayment(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() payment: PaymentInfo,
  ) {
    console.log(payment);
    return this.service.verifyTransaction(transactionId, payment);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() _body: LoginDTO, @Request() req: any) {
    return this.service.login(req.user);
  }
}
