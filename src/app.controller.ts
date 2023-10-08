import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO, PaymentInfo, PreOrderEmailDto } from './app.dto';
import { AppService } from './app.service';
import { AdminJwtAuthGuard } from './modules/admin/guards/jwt-auth-guard';

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
    return this.service.verifyTransaction(transactionId, payment);
  }

  @Post('login')
  login(@Body() { accessCode }: LoginDTO) {
    return this.service.login(accessCode);
  }

  @Post('send-pre-order-email')
  sendPreOrderEmail(@Body() preorderEmail: PreOrderEmailDto) {
    return this.service.sendPreOrderEmail(preorderEmail);
  }

  @Get('test-token')
  @UseGuards(AdminJwtAuthGuard)
  testToken() {
    return true;
  }
}
