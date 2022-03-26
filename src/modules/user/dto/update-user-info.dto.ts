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
import { ApiProperty } from '@nestjs/swagger';

/**
 * Update user dto
 */
class UpdateUserDto {
  /**
   * Username
   */
  @ApiProperty({
    type: 'string',
    required: false,
    title: 'Username',
    default: '',
  })
  @IsOptional()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  /**
   * First name
   */
  @ApiProperty({
    type: 'string',
    required: false,
    title: 'Firstname',
    default: '',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  /**
   * Lastname
   */
  @ApiProperty({
    type: 'string',
    required: false,
    title: 'Lastname',
    default: '',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  /**
   * Password
   */
  @ApiProperty({
    type: 'string',
    required: false,
    title: 'Password',
    default: '',
  })
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
  @ApiProperty({
    type: 'string',
    required: false,
    title: 'Phone number',
    default: '',
  })
  @IsOptional()
  @IsPhoneNumber()
  @MinLength(13)
  @MaxLength(13)
  phoneNumber: string;

  /**
   * Email
   */
  @ApiProperty({
    type: 'string',
    required: false,
    title: 'Email',
    default: '',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * Role
   */
  @ApiProperty({
    enum: UserRole,
    title: 'Role',
    required: false,
    default: '',
  })
  @IsOptional()
  @IsNotEmpty()
  role: UserRole;
}

export { UpdateUserDto };
