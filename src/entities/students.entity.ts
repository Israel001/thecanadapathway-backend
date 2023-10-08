import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students', { synchronize: false })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  fullName: string;

  @Column()
  @AutoMap()
  accessCode: string;

  @Column()
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  suspended: boolean;
}
