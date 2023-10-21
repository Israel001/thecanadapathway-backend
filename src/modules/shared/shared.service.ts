import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SmtpConfig } from 'src/config/types/smtp.config';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { IEmailDto } from 'src/types';
import { replacer } from 'src/utils';
import { Repository } from 'typeorm';
import mailer from 'nodemailer-promise';

@Injectable()
export class SharedService {
  private readonly smtpConfig: SmtpConfig;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(NotificationTemplates)
    private readonly notificationTemplateRepository: Repository<NotificationTemplates>,
  ) {
    this.smtpConfig = this.configService.get<SmtpConfig>('smtpConfig');
  }

  async sendEmail(email: IEmailDto) {
    const sendMail = mailer.config({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      secure: true,
      from: 'DY Travels <info@thecanadapathway.com>',
      auth: {
        user: this.smtpConfig.username,
        pass: this.smtpConfig.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const notificationTemplate =
      await this.notificationTemplateRepository.findOne({
        where: {
          code: email.templateCode,
        },
      });
    if (!notificationTemplate)
      throw new NotFoundException(
        `Notification template: ${email.templateCode} does not exist`,
      );
    email.html = email.data
      ? replacer(0, Object.entries(email.data), notificationTemplate.body)
      : notificationTemplate.body;
    delete email.templateCode;
    if (!email.bcc) email.bcc = 'info@thecanadapathway.com';
    if (!email.from)
      email.from = 'TheCanadaPathway <info@thecanadapathway.com>';
    sendMail(email);
  }
}
