import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paginate, Status } from '@core';
import { formatUserToReturn } from './utils';
import {
  CreateUserDto,
  CreateUserResponseDto,
  DeleteByIdsDto,
  GetCurrentUserResponseDto,
  GetUsersFilterDto,
  GetUsersResponseDto,
  UpdateCurrentUserDto,
  UpdateUserByIdDto,
} from './dto';
import { UserEntity } from './user.entity';
import { UserToReturn } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getCurrentUser(userId: number): Promise<GetCurrentUserResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      status: Status.ACTIVE,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      role: user.role,
    };
  }

  async updateCurrentUser(
    userId: number,
    updateCurrentUserDto: UpdateCurrentUserDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      status: Status.ACTIVE,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userRepository.save({ ...user, ...updateCurrentUserDto });
  }

  async getUsers({
    page,
    perPage,
    ...filterDto
  }: GetUsersFilterDto): Promise<GetUsersResponseDto> {
    const query = this.userRepository.createQueryBuilder('user');

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'role') {
        query.andWhere('user.role = :role', { role: value });

        return;
      }

      query.andWhere(`user.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    const { totalAmount, totalPages, data } = await paginate<UserEntity>({
      query,
      page,
      perPage,
    });

    const response: GetUsersResponseDto = {
      data: data.map(formatUserToReturn),
      totalAmount,
      totalPages,
    };

    if (page && perPage) {
      response.page = +page;
      response.perPage = +perPage;
    }

    return response;
  }

  async getUserById(id: number): Promise<UserToReturn> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return formatUserToReturn(user);
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const { firstname, lastname, phone, password, role, email, description } =
      createUserDto;

    const user = new UserEntity();

    user.firstname = firstname;
    user.lastname = lastname;
    user.description = description;
    user.phone = phone;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = role;
    user.status = Status.ACTIVE;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return {
      id: user.id,
    };
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserByIdDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.keys(updateUserDto).map((key) => {
      user[key] = updateUserDto[key];
    });

    await this.userRepository.save(user);
  }

  async deleteUserById(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.save({ ...user, status: Status.DELETED });
  }

  async deleteUsersByIds(deleteByIdsDto: DeleteByIdsDto): Promise<void> {
    const users = await this.userRepository.findBy({
      id: In(deleteByIdsDto.ids),
      status: Status.ACTIVE,
    });

    if (!users.length) {
      throw new NotFoundException(
        `Users with ids ${deleteByIdsDto.ids.join(', ')} not found`,
      );
    }

    users.forEach((user) => {
      user.status = Status.DELETED;
    });

    await this.userRepository.save(users);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
