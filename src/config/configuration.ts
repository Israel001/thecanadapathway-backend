import { registerAs } from '@nestjs/config';
import { FlutterwaveConfig } from './types/flutterwave.config';
import { JwtAuthConfig } from './types/jwt-auth.config';

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
