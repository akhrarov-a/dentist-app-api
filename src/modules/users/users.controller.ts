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
    type: GetCurrentUserResponseDto,
  })
  @Get('/current')
  getCurrentUser(
    @GetUser() user: UserEntity,
  ): Promise<GetCurrentUserResponseDto> {
    return this.usersService.getCurrentUser(user.id);
  }

  @ApiOperation({
    summary: 'Request for updating current user',
    description: 'If you want to update current user, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully updated',
  })
  @Patch('/current')
  updateCurrentUser(
    @Body(ValidationPipe) updateCurrentUserDto: UpdateCurrentUserDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.usersService.updateCurrentUser(user.id, updateCurrentUserDto);
  }

  @ApiOperation({
    summary: 'Request for getting users',
    description: 'If you want to get users, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: GetUsersResponseDto,
  })
  @Get()
  @UseGuards(AdminGuard)
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<GetUsersResponseDto> {
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
    type: CreateUserResponseDto,
  })
  @Post()
  @UseGuards(AdminGuard)
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Request for updating user by id',
    description: 'If you want to update user by id, use this request',
  })
  @ApiOkResponse({ description: 'Successfully updated' })
  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserByIdDto,
  ): Promise<void> {
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
    return this.usersService.deleteUserById(id);
  }

  @ApiOperation({
    summary: 'Request for deleting users by ids',
    description: 'If you want to delete users by ids, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/by/ids')
  @UseGuards(AdminGuard)
  deleteUsersByIds(
    @Body(ValidationPipe) deleteByIdsDto: DeleteByIdsDto,
  ): Promise<void> {
    return this.usersService.deleteUsersByIds(deleteByIdsDto);
  }
}
