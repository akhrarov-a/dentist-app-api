import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from '@core';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserToReturn } from './types';
import { GetUsersFilterDto, UpdateUserDto } from './dto';
import { formatUser } from './utils';
import { User } from './user.entity';

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
        '(user.firstname LIKE :search OR user.lastname LIKE :search OR user.username LIKE :search OR user.phone_number LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const { total, data } = await paginate<User>({ query, page, perPage });

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
   * Update user by id
   */
  async updateUserById(
    id: number,
    body: UpdateUserDto,
  ): Promise<{ user: UserToReturn }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.keys(body).map((key) => {
      switch (key) {
        case 'phoneNumber':
          user.phone_number = body.phoneNumber;

          break;

        case 'password':
          break;

        default:
          user[key] = body[key];
      }
    });

    if (body.password) {
      user.password = await this.hashPassword(body.password, user.salt);
    }

    await user.save();

    return {
      user: formatUser(user),
    };
  }

  /**
   * Delete user by id
   */
  async deleteUserById(id: number): Promise<void> {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Hash password
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

export { UserService };
