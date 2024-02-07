import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './middleware/request-logger-middleware';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  FlutterwaveConfiguration,
  JwtAuthConfiguration,
} from './config/configuration';
import { AppController } from './app.controller';
import { AddCorrelationIdInterceptor } from './lib/add-correlation-id-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './lib/timeout.interceptor';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthConfig } from './config/types/jwt-auth.config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './modules/admin/admin.module';
import * as ormconfig from './config/ormconfig';
import { Student } from './entities/students.entity';
import { Payment } from './entities/payments.entity';
import { AdminJwtStrategy } from './modules/admin/strategies/jwt.strategy';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    PassportModule,
    AutomapperModule.forRoot({
      options: [{ name: 'classMapper', pluginInitializer: classes }],
      singular: true,
    }),
    ConfigModule.forRoot({
      load: [FlutterwaveConfiguration, JwtAuthConfiguration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [JwtAuthConfiguration] })],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtAuthConfig>('jwtAuthConfig').secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Student, Payment]),
    SharedModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AddCorrelationIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    AppService,
    AdminJwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
