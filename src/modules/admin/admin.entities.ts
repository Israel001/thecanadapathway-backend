import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_users', { synchronize: false })
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  fullName: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  password: string;
}
