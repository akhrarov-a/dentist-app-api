import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Language, UserRole } from '@core';

export class UpdateUserByIdDto {
  @ApiProperty({ description: 'Firstname of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Description of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Phone of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ description: 'Email of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Layout title of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  layoutTitle: string;

  @ApiProperty({
    description: 'Language of the user',
    enum: Language,
    required: false,
  })
  @IsOptional()
  @IsIn([Language.RU, Language.EN])
  language: Language;

  @ApiProperty({ description: 'Holidays of the user', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays: string[];

  @ApiProperty({ description: 'Weekends of the user', required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  weekends: number[];

  @ApiProperty({
    description: 'Role of the user',
    required: false,
    enum: UserRole,
  })
  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.DENTIST])
  role: UserRole;
}
