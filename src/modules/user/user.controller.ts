import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

/**
 * User Controller
 */
@Controller('user')
@UseGuards(AuthGuard())
class UserController {
  constructor(private userService: UserService) {}
}

export { UserController };
