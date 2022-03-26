import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserToReturn } from '@user';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { JwtPayload } from './types';

/**
 * Auth Service
 */
@Injectable()
class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Sign up
   */
  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const {
      username,
      password,
      firstname,
      lastname,
      phoneNumber,
      email,
      role,
    } = signUpCredentialsDto;

    const existsPhoneNumber = await this.userRepository.findOne({
      where: { phone_number: phoneNumber },
    });
    if (existsPhoneNumber) {
      throw new ConflictException('User with this phone number already exists');
    }

    const existsUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existsUsername) {
      throw new ConflictException('User with this username already exists');
    }

    const existsEmail = await this.userRepository.findOne({ where: { email } });
    if (existsEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new User();

    user.first_name = firstname;
    user.last_name = lastname;
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.phone_number = phoneNumber;
    user.email = email;
    user.role = role;

    await user.save();
  }

  /**
   * Sign in
   */
  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string; expires: string }> {
    const { login, password } = signInCredentialsDto;

    const query = this.userRepository.createQueryBuilder('user');

    query.where(
      'user.username = :login OR user.phone_number = :login OR user.email = :login',
      { login },
    );

    const user = await query.getOne();

    if (!(user && (await user.validatePassword(password)))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      expires: this.config.get<string>('JWT_EXPIRES_IN'),
    };
  }

  /**
   * Get me
   */
  async getMe(token: string): Promise<{ user: UserToReturn }> {
    const jwtPayload: any = await this.jwtService.decode(token);

    const { id, email, username, first_name, last_name, phone_number, role } =
      await this.userRepository.findOne({
        where: { username: jwtPayload?.username },
      });

    return {
      user: {
        id,
        email,
        firstname: first_name,
        lastname: last_name,
        username,
        phoneNumber: phone_number,
        role,
      },
    };
  }

  /**
   * Hash password
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

export { AuthService };
