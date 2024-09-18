import { BaseEntity as TypeormBaseEntity } from 'typeorm';
export declare class BaseEntity extends TypeormBaseEntity {
    createdAt: Date;
    updatedAt: Date;
}
