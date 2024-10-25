import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { formatUserToReturn } from './utils';
import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserToReturn } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getCurrent(userId: number): Promise<UserToReturn> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return formatUserToReturn(user);
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<UserToReturn[]> {
    const query = this.userRepository.createQueryBuilder('user');

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'role') {
        query.andWhere('user.role = :role', { role: value });

        return;
      }

      query.andWhere(`patient.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    return (await query.getMany()).map(formatUserToReturn);
  }

  async getUserById(id: number): Promise<UserToReturn> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return formatUserToReturn(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserToReturn> {
    const { firstname, lastname, phone, password, role, email, description } =
      createUserDto;

    const user = new UserEntity();

    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    user.role = role;
    user.email = email;
    user.description = description;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return formatUserToReturn(user);
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserToReturn> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return formatUserToReturn(await this.userRepository.save(user));
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
