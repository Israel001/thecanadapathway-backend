import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLocalStrategy } from './strategies/local.strategy';
import { AdminJwtStrategy } from './strategies/jwt.strategy';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './admin.entities';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthConfiguration } from 'src/config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthConfig } from 'src/config/types/jwt-auth.config';
import { Student } from 'src/entities/students.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, Student]),
    PassportModule,
    ConfigModule.forRoot({ load: [JwtAuthConfiguration] }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [JwtAuthConfiguration] })],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtAuthConfig>('jwtAuthConfig').secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AdminService, AdminLocalStrategy, AdminJwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
