import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@core';

export class UpdateCurrentUserDto {
  @ApiProperty({
    description: 'Firstname of the current user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the current user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'Phone of the current user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    description: 'Language of the user',
    enum: Language,
    required: false,
  })
  @IsOptional()
  @IsIn([Language.RU, Language.EN])
  language: Language;

  @ApiProperty({ description: 'Layout title of the user', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  layoutTitle: string;
}
