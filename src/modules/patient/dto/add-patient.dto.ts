import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Add patient dto
 */
class AddPatientDto {
  /**
   * Firstname
   */
  @IsNotEmpty()
  firstname: string;

  /**
   * Lastname
   */
  @IsNotEmpty()
  lastname: string;

  /**
   * Phone number
   */
  @IsPhoneNumber()
  @MinLength(13, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  phoneNumber: string;

  /**
   * Email
   */
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * Description
   */
  @IsNotEmpty()
  description: string;

  /**
   * User
   */
  @IsNotEmpty()
  user: number;
}

export { AddPatientDto };
