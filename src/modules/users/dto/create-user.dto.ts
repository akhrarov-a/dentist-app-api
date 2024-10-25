import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsIn([UserRole.ADMIN, UserRole.DENTIST, UserRole.PATIENT])
  role: UserRole;
}
