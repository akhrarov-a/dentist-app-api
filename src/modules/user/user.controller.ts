import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, UserToReturn } from './types';
import { GetUsersFilterDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { UserRoleValidationPipe } from '@auth/pipes';
import { AdminGuard } from '@core';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * User Controller
 */
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get users
   */
  @ApiOperation({
    summary: 'Request for getting users with pagination and search',
    description:
      'If you want get users with pagination and search, use this request',
  })
  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<{ total: number; perPage?: number; users: UserToReturn[] }> {
    return this.userService.getUsers(filterDto);
  }

  /**
   * Get user by id
   */
  @ApiOperation({
    summary: 'Request for getting user by id',
    description: 'If you want get user by id, use this request',
  })
  @Get('/:id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ user: UserToReturn }> {
    return this.userService.getUserById(id);
  }

  /**
   * Update user by id
   */
  @ApiOperation({
    summary: 'Request for updating user info by id',
    description: 'If you want update user info by id, use this request',
  })
  @Patch('/:id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdateUserDto,
    @Body('role', UserRoleValidationPipe) role: UserRole,
  ): Promise<{ user: UserToReturn }> {
    return this.userService.updateUserById(id, body);
  }

  /**
   * Delete user by id
   */
  @ApiOperation({
    summary: 'Request for deleting user info by id',
    description: 'If you want delete user info by id, use this request',
  })
  @Delete('/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.deleteUserById(id);
  }
}

export { UserController };
