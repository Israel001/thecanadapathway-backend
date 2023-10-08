import { registerAs } from '@nestjs/config';
import { FlutterwaveConfig } from './types/flutterwave.config';
import { JwtAuthConfig } from './types/jwt-auth.config';
import { SmtpConfig } from './types/smtp.config';

export const FlutterwaveConfiguration = registerAs(
  'flutterwaveConfig',
  (): FlutterwaveConfig => ({
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    baseUrl: process.env.FLUTTERWAVE_BASE_URL,
  }),
);

export const JwtAuthConfiguration = registerAs(
  'jwtAuthConfig',
  (): JwtAuthConfig => ({
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
  }),
);

export const SmtpConfiguration = registerAs(
  'smtpConfig',
  (): SmtpConfig => ({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  }),
);
