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
import { UserRole } from '@user';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Sign up credentials dto
 */
class SignUpCredentialsDto {
  /**
   * Username
   */
  @ApiProperty({ type: 'string', title: 'Username', default: '' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  /**
   * Email
   */
  @ApiProperty({ type: 'string', title: 'Email', default: '' })
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * Password
   */
  @ApiProperty({ type: 'string', title: 'Password', default: '' })
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
  @ApiProperty({ type: 'string', title: 'Firstname', default: '' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  /**
   * Last name
   */
  @ApiProperty({ type: 'string', title: 'Lastname', default: '' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  /**
   * Phone number
   */
  @ApiProperty({ type: 'string', title: 'Phone number', default: '' })
  @IsPhoneNumber()
  @MinLength(13)
  @MaxLength(13)
  phoneNumber: string;

  /**
   * Role
   */
  @ApiProperty({ enum: UserRole, title: 'Role', default: UserRole.DENTIST })
  role: UserRole;
}

export { SignUpCredentialsDto };
