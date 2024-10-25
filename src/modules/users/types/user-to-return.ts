import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user-role.enum';

export class UserToReturn {
  @ApiProperty({ description: 'ID of the user' })
  id: number;

  @ApiProperty({ description: 'Firstname of the user' })
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user' })
  lastname: string;

  @ApiProperty({ description: 'Description of the user' })
  description: string;

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
