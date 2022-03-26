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
 * Update patient dto
 */
class UpdatePatientDto {
  /**
   * Firstname
   */
  @ApiProperty({
    type: 'string',
    title: 'Firstname',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  firstname: string;

  /**
   * Lastname
   */
  @ApiProperty({
    type: 'string',
    title: 'Lastname',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  lastname: string;

  /**
   * Phone number
   */
  @ApiProperty({
    type: 'string',
    title: 'Phone number',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  @MinLength(13, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  phoneNumber: string;

  /**
   * Description
   */
  @ApiProperty({
    type: 'string',
    title: 'Description',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  description: string;

  /**
   * Email
   */
  @ApiProperty({
    type: 'string',
    title: 'Email',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}

export { UpdatePatientDto };
