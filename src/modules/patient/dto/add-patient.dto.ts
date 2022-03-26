import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Add patient dto
 */
class AddPatientDto {
  /**
   * Firstname
   */
  @ApiProperty({ type: 'string', title: 'Firstname', default: '' })
  @IsNotEmpty()
  firstname: string;

  /**
   * Lastname
   */
  @ApiProperty({ type: 'string', title: 'Lastname', default: '' })
  @IsNotEmpty()
  lastname: string;

  /**
   * Phone number
   */
  @ApiProperty({ type: 'string', title: 'Phone number', default: '' })
  @IsPhoneNumber()
  @MinLength(13, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  phoneNumber: string;

  /**
   * Email
   */
  @ApiProperty({ type: 'string', title: 'Email', default: '' })
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * Description
   */
  @ApiProperty({ type: 'string', title: 'Description', default: '' })
  @IsNotEmpty()
  description: string;

  /**
   * User
   */
  @ApiProperty({ type: 'number', title: 'User', default: '' })
  @IsNotEmpty()
  user: number;
}

export { AddPatientDto };
