import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types';

export class GetCurrentUserResponseDto {
  @ApiProperty({ description: 'ID of the user' })
  id: number;

  @ApiProperty({ description: 'Firstname of the user' })
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user' })
  lastname: string;

  @ApiProperty({ description: 'Phone of the user' })
  phone: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
  })
  role: UserRole;
}
