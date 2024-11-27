import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshDto, SignInDto, SignInResponseDto } from './dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Request for signing in',
    description: 'If you want to sign in, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: SignInResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @ApiOperation({
    summary: 'Request for refreshing access token',
    description: 'If you want to refresh access token, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully refreshed',
    type: SignInResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('refresh')
  refresh(
    @Body(ValidationPipe) refreshRequestDto: RefreshDto,
  ): Promise<SignInResponseDto> {
    return this.authService.refreshAccessToken(refreshRequestDto);
  }

  @ApiOperation({
    summary: 'Request for logout',
    description: 'If you want to logout, use this request',
  })
  @ApiOkResponse({ description: 'Successfully logged out' })
  @Get('logout')
  logout(): Promise<void> {
    return this.authService.logout();
  }
}
