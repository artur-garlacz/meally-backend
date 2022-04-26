import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserDetailsEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userAddressId: string;
  @IsString()
  @IsNotEmpty()
  readonly address1: string;
  @IsString()
  readonly address2: string;
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
