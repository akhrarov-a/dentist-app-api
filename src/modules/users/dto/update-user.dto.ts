import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserRole } from '../types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.DENTIST, UserRole.PATIENT])
  role: UserRole;
}
