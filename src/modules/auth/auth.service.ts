import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Status } from '@core';
import { UserEntity } from '@users/user.entity';
import { RefreshDto, SignInDto, SignInResponseDto } from './dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signIn(authCredentialsDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAndSaveAndReturnTokens(user);
  }

  async refreshAccessToken(refreshDto: RefreshDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.findOne({
      where: { refreshToken: refreshDto.refreshToken, status: Status.ACTIVE },
    });

    if (!user || user.refreshTokenExpiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    return this.generateAndSaveAndReturnTokens(user);
  }

  async logout(user: UserEntity): Promise<void> {
    user.refreshToken = null;
    user.refreshTokenExpiresAt = null;

    await this.userRepository.save(user);
  }

  private async generateAndSaveAndReturnTokens(
    user: UserEntity,
  ): Promise<SignInResponseDto> {
    const accessToken = await this.generateAccessToken(user.email);
    const refreshToken = await this.generateRefreshToken(user.email);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
    };
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
    authCredentialsDto: SignInDto,
  ): Promise<UserEntity> {
    const { email, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }
}
