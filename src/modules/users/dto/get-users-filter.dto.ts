import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserRole } from '../types';

export class GetUsersFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.DENTIST, UserRole.PATIENT])
  role: UserRole;
}
