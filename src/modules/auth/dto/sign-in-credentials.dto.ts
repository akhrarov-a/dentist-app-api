import { IsNotEmpty } from 'class-validator';

/**
 * Sign in credentials dto
 */
class SignInCredentialsDto {
  /**
   * Login
   */
  @IsNotEmpty()
  login: string;

  /**
   * Password
   */
  @IsNotEmpty()
  password: string;
}

export { SignInCredentialsDto };
