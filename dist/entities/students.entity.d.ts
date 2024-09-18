import { BaseEntity } from 'src/base/entity';
export declare class Student extends BaseEntity {
    id: number;
    fullName: string;
    accessCode: string;
    email: string;
    suspended: boolean;
}
