import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(filterDto: GetUsersFilterDto): Promise<UserEntity[]> {
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

    return await query.getMany();
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { firstname, lastname, phone, password, role, email, description } =
      createUserDto;

    const user = new UserEntity();

    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    user.password = password;
    user.role = role;
    user.email = email;
    user.description = description;

    await user.save();

    return user;
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
