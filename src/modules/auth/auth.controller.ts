import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole, UserToReturn } from '@user';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { UserRoleValidationPipe } from './pipes';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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

  /**
   * Sign in
   */
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string; expires: string }> {
    return this.authService.signIn(signInCredentialsDto);
  }

  /**
   * Get me
   */
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req): Promise<{ user: UserToReturn }> {
    const token = req.headers.authorization.replace('Bearer ', '');

    return this.authService.getMe(token);
  }
}

export { AuthController };
