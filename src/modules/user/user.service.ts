import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from '@core';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserToReturn } from './types';
import { GetUsersFilterDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { formatUser } from '@user/utils';

/**
 * User Service
 */
@Injectable()
class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * Get users
   */
  async getUsers(
    filterDto: GetUsersFilterDto,
  ): Promise<{ total: number; perPage?: number; users: UserToReturn[] }> {
    const { search, page, perPage } = filterDto;

    const query = this.userRepository.createQueryBuilder('user');

    if (search) {
      await query.andWhere(
        '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.username LIKE :search OR user.phone_number LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const { total, data } = await paginate<User>(query, page, perPage);

    const response: { total: number; perPage?: number; users: UserToReturn[] } =
      {
        total,
        users: data.map((user) => formatUser(user)),
      };

    if (page && perPage) {
      response.perPage = +perPage;
    }

    return response;
  }

  /**
   * Get user by id
   */
  async getUserById(id: number): Promise<{ user: UserToReturn }> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      user: formatUser(user),
    };
  }

  /**
   * Update user info
   */
  async updateUserInfo(
    id: number,
    body: UpdateUserDto,
  ): Promise<{ user: UserToReturn }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const {
      username,
      password,
      firstname,
      lastname,
      phoneNumber,
      email,
      role,
    } = body;

    user.username = username;
    user.first_name = firstname;
    user.last_name = lastname;
    user.phone_number = phoneNumber;
    user.email = email;
    user.role = role;

    if (password) {
      user.password = await this.hashPassword(password, user.salt);
    }

    await user.save();

    return {
      user: formatUser(user),
    };
  }

  /**
   * Hash password
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

export { UserService };
