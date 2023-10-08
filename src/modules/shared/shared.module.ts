import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule } from '@nestjs/config';
import { SmtpConfiguration } from 'src/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTemplates]),
    ConfigModule.forRoot({ load: [SmtpConfiguration] }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
