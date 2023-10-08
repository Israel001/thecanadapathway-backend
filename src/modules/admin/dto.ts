import { IsEmail, IsString } from 'class-validator';

export class AdminLoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class AdminUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
