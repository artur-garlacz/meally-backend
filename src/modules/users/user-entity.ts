import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userId: string;
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
}

/// userOffers
