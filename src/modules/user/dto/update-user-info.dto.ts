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
import { UserRole } from '../types';

/**
 * Update user dto
 */
class UpdateUserDto {
  /**
   * Username
   */
  @IsOptional()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

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
   * Password
   */
  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  /**
   * Phone number
   */
  @IsOptional()
  @IsPhoneNumber()
  @MinLength(13)
  @MaxLength(13)
  phoneNumber: string;

  /**
   * Email
   */
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * Role
   */
  @IsOptional()
  @IsNotEmpty()
  role: UserRole;
}

export { UpdateUserDto };
