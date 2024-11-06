import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { AuthCredentialsDto, SignInResponseDto } from './dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<SignInResponseDto> {
    const email = await this.validateUserPassword(authCredentialsDto);

    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(email);
    const refreshToken = await this.generateRefreshToken(email);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<SignInResponseDto> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const user = await this.userRepository.findOne({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        accessToken: await this.generateAccessToken(user.email),
        refreshToken,
      };
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  private async generateAccessToken(email: string): Promise<string> {
    const payload: JwtPayload = { email };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(email: string): Promise<string> {
    const payload: JwtPayload = { email };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  private async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }
}
