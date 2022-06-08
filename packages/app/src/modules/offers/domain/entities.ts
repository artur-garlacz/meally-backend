import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { OfferStatusType } from '../api/get-offers';

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
  readonly unitPrice: number;
  @IsString()
  @IsNotEmpty()
  readonly longDesc: string;
  @IsString()
  @IsNotEmpty()
  readonly shortDesc: string;
  @IsNotEmpty()
  readonly status: OfferStatusType;
  @IsNumber()
  @IsNotEmpty()
  readonly availableQuantity: number;
  @IsBoolean()
  @IsNotEmpty()
  readonly promoted: boolean;
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
