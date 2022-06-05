import { IsNullable } from '@libs/utils/validation';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userId: string;
  @IsString()
  @IsNotEmpty()
  readonly email: string;
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
  @IsNullable()
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
  @IsUUID('4')
  @IsString()
  readonly userId: string;
}

export class UserPasswordEntity {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userPasswordId: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
  @IsUUID('4')
  @IsString()
  readonly userId: string;
}

export class UserSchedule {
  @IsUUID('4')
  @IsNotEmpty()
  readonly userScheduleId: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly isMainSchedule: boolean;
  @IsString()
  @IsNotEmpty()
  readonly userScheduleName: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly scheduleId: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly userId: string;
}

export class Schedule {
  @IsUUID('4')
  @IsNotEmpty()
  readonly scheduleId: string;
  @IsString()
  @IsNotEmpty()
  readonly day: boolean;
  @IsString()
  @IsNotEmpty()
  readonly hourFrom: string;
  @IsString()
  @IsNotEmpty()
  readonly hourTo: string;
  @IsUUID('4')
  @IsNotEmpty()
  readonly userScheduleId: string;
}
