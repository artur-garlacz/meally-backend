import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { OrderStatusType } from '../api/get-orders';

export class OrderEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly offerOrderId: string;
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
  @IsNotEmpty()
  readonly status: OrderStatusType;
  @IsUUID('4')
  @IsNotEmpty()
  readonly offerId: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly customerId: string;
}
