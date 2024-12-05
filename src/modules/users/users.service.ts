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
      layoutTitle: user.layoutTitle,
      language: user.language,
      holidays: user.holidays,
      weekends: user.weekends,
      workingHours: user.workingHours,
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

      if (['role', 'status'].includes(key)) {
        query.andWhere(`user.${key} = :${key}`, { [key]: value });

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
    const {
      firstname,
      lastname,
      phone,
      password,
      role,
      email,
      description,
      layoutTitle,
      language,
      holidays,
      weekends,
      workingHours,
    } = createUserDto;

    const user = new UserEntity();

    user.firstname = firstname;
    user.lastname = lastname;
    user.description = description;
    user.phone = phone;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.layoutTitle = layoutTitle;
    user.weekends = weekends;
    user.holidays = holidays;
    user.workingHours = workingHours;
    user.language = language;
    user.role = role;
    user.status = Status.ACTIVE;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          errorCode: '23505',
          message: 'User with this email already exists',
        });
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
    const anotherUserWithThisEmail = await this.userRepository.findOneBy({
      email: updateUserDto.email,
      status: Status.ACTIVE,
    });

    if (anotherUserWithThisEmail && anotherUserWithThisEmail.id !== id) {
      throw new ConflictException({
        errorCode: '23505',
        message: 'User with this email already exists',
      });
    }

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
