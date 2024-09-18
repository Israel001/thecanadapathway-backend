import { BaseEntity } from 'src/base/entity';
export declare class Payment extends BaseEntity {
    id: number;
    transactionId: number;
    reference: string;
    email: string;
    metadata: string;
}
