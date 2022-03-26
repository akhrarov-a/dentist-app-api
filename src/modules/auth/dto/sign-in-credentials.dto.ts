import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Sign in credentials dto
 */
class SignInCredentialsDto {
  /**
   * Login
   */
  @ApiProperty({ type: 'string', title: 'Login', default: '' })
  @IsNotEmpty()
  login: string;

  /**
   * Password
   */
  @ApiProperty({ type: 'string', title: 'Password', default: '' })
  @IsNotEmpty()
  password: string;
}

export { SignInCredentialsDto };
