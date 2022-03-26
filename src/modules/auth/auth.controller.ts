import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser, User, UserRole, UserToReturn } from '@user';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { UserRoleValidationPipe } from './pipes';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Auth Controller
 */
@ApiTags('auth')
@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Sign up
   */
  @ApiOperation({
    summary: 'Request for sign up new user',
    description: 'If you want sign up new user, use this request',
  })
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
  @ApiOperation({
    summary: 'Request for sign in',
    description: 'If you want sign in, use this request',
  })
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string; expires: string }> {
    return this.authService.signIn(signInCredentialsDto);
  }

  /**
   * Get me
   */
  @ApiOperation({
    summary: 'Request for getting current user',
    description: 'If you want get your signed in user, use this request',
  })
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user: User): Promise<{ user: UserToReturn }> {
    return this.authService.getMe(user.id);
  }
}

export { AuthController };
