import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types';

export class GetUsersFilterDto {
  @ApiProperty({ description: 'Firstname of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'Description of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Phone of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ description: 'Email of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    required: false,
    enum: UserRole,
  })
  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.DENTIST, UserRole.PATIENT])
  role: UserRole;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({ description: 'Per page number', required: false })
  @IsOptional()
  @IsNumberString()
  perPage: number;
}
