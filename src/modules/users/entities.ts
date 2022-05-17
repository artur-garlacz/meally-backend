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

export class UserDetailsEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userDetailsId: string;
  @IsString()
  @IsNotEmpty()
  readonly address1: string;
  @IsString()
  readonly address2: string | null;
  @IsString()
  @IsNotEmpty()
  readonly city: string;
  @IsString()
  @IsNotEmpty()
  readonly postalCode: string;
  @IsString()
  @IsNotEmpty()
  readonly country: string;
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsString()
  readonly userId: string;
}
