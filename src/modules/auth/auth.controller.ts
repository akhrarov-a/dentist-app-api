import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthCredentialsDto, SignInResponseDto } from './dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Request for sign in',
    description: 'If you want sign in, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: SignInResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }
}
