import { BaseEntity } from 'typeorm';
export declare class NotificationTemplates extends BaseEntity {
    id: number;
    code: string;
    body: string;
}
