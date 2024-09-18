import { FlutterwaveConfig } from './types/flutterwave.config';
import { JwtAuthConfig } from './types/jwt-auth.config';
import { SmtpConfig } from './types/smtp.config';
export declare const FlutterwaveConfiguration: (() => FlutterwaveConfig) & import("@nestjs/config").ConfigFactoryKeyHost<FlutterwaveConfig>;
export declare const JwtAuthConfiguration: (() => JwtAuthConfig) & import("@nestjs/config").ConfigFactoryKeyHost<JwtAuthConfig>;
export declare const SmtpConfiguration: (() => SmtpConfig) & import("@nestjs/config").ConfigFactoryKeyHost<SmtpConfig>;
