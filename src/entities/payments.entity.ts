import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments', { synchronize: true })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  transactionId: number;

  @Column()
  @AutoMap()
  reference: string;

  @Column()
  @AutoMap()
  email: string;

  @Column('longtext')
  @AutoMap()
  metadata: string;
}
