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

/**
 * User Controller
 */
@Controller('users')
@UseGuards(AuthGuard('jwt'))
class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get users
   */
  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<{ total: number; perPage?: number; users: UserToReturn[] }> {
    return this.userService.getUsers(filterDto);
  }

  /**
   * Get user by id
   */
  @Get('/:id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ user: UserToReturn }> {
    return this.userService.getUserById(id);
  }

  /**
   * Update user info
   */
  @Patch('/:id')
  updateUserInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdateUserDto,
    @Body('role', UserRoleValidationPipe) role: UserRole,
  ): Promise<{ user: UserToReturn }> {
    return this.userService.updateUserInfo(id, body);
  }

  /**
   * Delete user by id
   */
  @Delete('/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.deleteUserById(id);
  }
}

export { UserController };
