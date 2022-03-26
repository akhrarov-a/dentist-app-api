import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignUpCredentialsDto } from './dto';
import { UserRoleValidationPipe } from './pipes';
import { UserRole } from './types';
import { AuthService } from './auth.service';

/**
 * Auth Controller
 */
@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Sign up
   */
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto,
    @Body('role', UserRoleValidationPipe) role: UserRole,
  ): Promise<void> {
    return this.authService.signUp(signUpCredentialsDto);
  }
}

export { AuthController };
