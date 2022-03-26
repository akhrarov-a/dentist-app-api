import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserToReturn } from './types';
import { GetUsersFilterDto } from './dto';
import { UserService } from './user.service';

/**
 * User Controller
 */
@Controller()
@UseGuards(AuthGuard('jwt'))
class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get users
   */
  @Get('/users')
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<{ total: number; perPage?: number; users: UserToReturn[] }> {
    return this.userService.getUsers(filterDto);
  }
}

export { UserController };
