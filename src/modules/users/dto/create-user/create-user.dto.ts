import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Language, passwordRegex, UserRole } from '@core';

export class CreateUserDto {
  @ApiProperty({ description: 'Firstname of the user' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Description of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Phone of the user' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(passwordRegex, { message: 'Password is too weak' })
  password: string;

  @ApiProperty({ description: 'Layout title of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  layoutTitle: string;

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

  @ApiProperty({ description: 'Working hours of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  workingHours: string;

  @ApiProperty({
    description: 'Language of the user',
    enum: Language,
    required: false,
  })
  @IsOptional()
  @IsIn([Language.RU, Language.EN])
  language: Language;

  @ApiProperty({ description: 'Role of the user', enum: UserRole })
  @IsIn([UserRole.ADMIN, UserRole.DENTIST])
  role: UserRole;
}
