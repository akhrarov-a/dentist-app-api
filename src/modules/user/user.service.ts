import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToReturn } from './types';
import { GetUsersFilterDto } from './dto';
import { User } from './user.entity';
import { paginate } from '@core/utils';

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

    let total: number, users: User[];

    if (search) {
      await query.andWhere(
        '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.username LIKE :search OR user.phone_number LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (page && perPage) {
      const result = await paginate(query, page, perPage);

      total = result.total;
      users = result.data;
    } else {
      total = await query.getCount();
      users = await query.getMany();
    }

    const response: { total: number; perPage?: number; users: UserToReturn[] } =
      {
        total,
        users: users.map(
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
      response.perPage = perPage;
    }

    return response;
  }
}

export { UserService };
