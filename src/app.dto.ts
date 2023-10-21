import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

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

export class PreOrderEmailDto {
  @IsString()
  fullName: string;

  @IsString()
  itemPrice: string;

  @IsString()
  offerPrice: string;

  @IsString()
  totalPrice: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  expiryDate: string;

  @IsString()
  page: string;

  @IsString()
  currency: string;
}
