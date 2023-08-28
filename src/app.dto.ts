import { IsEmail, IsNumber, IsString } from 'class-validator';

export class PaymentInfo {
  @IsNumber()
  amount: number;

  @IsEmail()
  email: string;
}

export class LoginDTO {
  @IsString()
  accessCode: string;
}
