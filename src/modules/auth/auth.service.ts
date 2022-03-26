import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignUpCredentialsDto } from './dto';
import { User } from './user.entity';

/**
 * Auth Service
 */
@Injectable()
class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
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
      where: { phoneNumber },
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
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.role = role;

    await user.save();
  }

  /**
   * Hash password
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

export { AuthService };
