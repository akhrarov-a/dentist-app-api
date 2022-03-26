import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UserRole } from '@auth/types';

/**
 * User role validation pipe
 */
class UserRoleValidationPipe implements PipeTransform {
  readonly allowedRoles = [UserRole.ADMIN, UserRole.DENTIST, UserRole.PATIENT];

  transform(value: UserRole): UserRole {
    value = value.toUpperCase() as UserRole;

    if (!this.isRoleValid(value)) {
      throw new BadRequestException(`${value} is an invalid user role`);
    }

    return value;
  }

  private isRoleValid(role: UserRole): boolean {
    return this.allowedRoles.indexOf(role) !== -1;
  }
}

export { UserRoleValidationPipe };
