import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Update patient dto
 */
class UpdatePatientDto {
  /**
   * Firstname
   */
  @IsOptional()
  @IsNotEmpty()
  firstname: string;

  /**
   * Lastname
   */
  @IsOptional()
  @IsNotEmpty()
  lastname: string;

  /**
   * Phone number
   */
  @IsOptional()
  @IsPhoneNumber()
  @MinLength(13, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  phoneNumber: string;

  /**
   * Description
   */
  @IsOptional()
  @IsNotEmpty()
  description: string;

  /**
   * Email
   */
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}

export { UpdatePatientDto };
