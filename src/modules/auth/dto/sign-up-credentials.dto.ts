import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '@auth/types';

/**
 * Sign up credentials dto
 */
class SignUpCredentialsDto {
  /**
   * Username
   */
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  /**
   * Email
   */
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * Password
   */
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  /**
   * First name
   */
  @IsString()
  @IsNotEmpty()
  firstname: string;

  /**
   * Last name
   */
  @IsString()
  @IsNotEmpty()
  lastname: string;

  /**
   * Phone number
   */
  @IsPhoneNumber()
  @MinLength(13)
  @MaxLength(13)
  phoneNumber: string;

  /**
   * Role
   */
  role: UserRole;
}

export { SignUpCredentialsDto };
