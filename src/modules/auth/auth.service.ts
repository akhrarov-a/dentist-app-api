import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
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

  async refreshAccessToken(refreshDto: RefreshDto): Promise<SignInResponseDto> {
    try {
      const decoded = this.jwtService.verify(refreshDto.refreshToken);

      const user = await this.userRepository.findOne({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        accessToken: await this.generateAccessToken(user.email),
        refreshToken: refreshDto.refreshToken, // TODO: generate new refresh token, delete old one
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(): Promise<void> {
    // TODO: implement logout delete refresh token
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
