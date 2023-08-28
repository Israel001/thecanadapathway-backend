import { IsString } from 'class-validator';

export class AdminLoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
