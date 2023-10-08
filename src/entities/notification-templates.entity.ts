import { AutoMap } from '@automapper/classes';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notification_templates', { synchronize: true })
export class NotificationTemplates extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  code: string;

  @Column({ type: 'text' })
  @AutoMap()
  body: string;
}
