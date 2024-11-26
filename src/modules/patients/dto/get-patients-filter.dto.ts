import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPatientsFilterDto {
  @ApiProperty({ description: 'Firstname of the patient', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the patient', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'Phone of the patient', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ description: 'Email of the patient', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Description of the patient', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({ description: 'Per page number', required: false })
  @IsOptional()
  @IsNumberString()
  perPage: number;
}
