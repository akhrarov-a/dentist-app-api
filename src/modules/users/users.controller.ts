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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@core';
import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { GetUser } from './utils';
import { UserToReturn } from './types';

@Controller('users')
@ApiTags('Users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Request for getting current user',
    description: 'If you want to get current user, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: UserToReturn,
  })
  @Get('/current')
  getCurrent(@GetUser() user: UserEntity): Promise<UserToReturn> {
    return this.usersService.getCurrent(user.id);
  }

  @ApiOperation({
    summary: 'Request for getting users',
    description: 'If you want to get users, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: [UserToReturn],
  })
  @Get()
  @UseGuards(AdminGuard)
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<UserToReturn[]> {
    return this.usersService.getUsers(filterDto);
  }

  @ApiOperation({
    summary: 'Request for getting user by id',
    description: 'If you want to get user by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: UserToReturn,
  })
  @Get('/:id')
  @UseGuards(AdminGuard)
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserToReturn> {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Request for creating user',
    description: 'If you want to create user, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: UserToReturn,
  })
  @Post()
  @UseGuards(AdminGuard)
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserToReturn> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Request for updating user by id',
    description: 'If you want to update user by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully updated',
    type: UserToReturn,
  })
  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserToReturn> {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Request for deleting user by id',
    description: 'If you want to delete user by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/:id')
  @UseGuards(AdminGuard)
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
