import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from '@core';
import { Repository } from 'typeorm';
import { UserToReturn } from './types';
import { GetUsersFilterDto } from './dto';
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
        '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.username LIKE :search OR user.phone_number LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const { total, data } = await paginate<User>(query, page, perPage);

    const response: { total: number; perPage?: number; users: UserToReturn[] } =
      {
        total,
        users: data.map(
          ({
            id,
            email,
            username,
            first_name,
            last_name,
            phone_number,
            role,
          }) => ({
            id,
            email,
            username,
            firstname: first_name,
            lastname: last_name,
            phoneNumber: phone_number,
            role,
          }),
        ),
      };

    if (page && perPage) {
      response.perPage = +perPage;
    }

    return response;
  }
}

export { UserService };
