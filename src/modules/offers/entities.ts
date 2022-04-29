import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class OfferCategoryEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly offerCategoryId: string;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly shortDesc: string;
}

export class OfferEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly offerId: string;
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  @IsDecimal()
  @IsNotEmpty()
  readonly price: number;
  @IsString()
  @IsNotEmpty()
  readonly longDesc: string;
  @IsString()
  @IsNotEmpty()
  readonly shortDesc: string;
  @IsNumber()
  @IsNotEmpty()
  readonly availableQuantity: number;
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
  @IsUUID('4')
  @IsNotEmpty()
  readonly userId: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly offerCategoryId: string;
}
