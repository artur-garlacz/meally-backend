import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class UserReviewEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userReviewId: string;
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
  @IsNumber()
  @IsNotEmpty()
  readonly rate: number;
  @IsString()
  @IsNotEmpty()
  readonly message: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly userId: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly customerId: string;
}
