import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './utils';
import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { UserToReturn } from './types';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<UserEntity[]> {
    return this.usersService.getUsers(filterDto);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Get('/current')
  getCurrent(@GetUser() user: UserEntity): Promise<{ user: UserToReturn }> {
    return this.usersService.getCurrent(user.id);
  }
}
