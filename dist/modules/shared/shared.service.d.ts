import { ConfigService } from '@nestjs/config';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { IEmailDto } from 'src/types';
import { Repository } from 'typeorm';
export declare class SharedService {
    private readonly configService;
    private readonly notificationTemplateRepository;
    private readonly smtpConfig;
    constructor(configService: ConfigService, notificationTemplateRepository: Repository<NotificationTemplates>);
    sendEmail(email: IEmailDto): Promise<void>;
}
