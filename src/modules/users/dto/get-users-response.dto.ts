import { ApiProperty } from '@nestjs/swagger';
import { UserToReturn } from '../types';

export class GetUsersResponseDto {
  @ApiProperty({ description: 'Total users number' })
  totalUsers: number;

  @ApiProperty({ description: 'Total pages number' })
  totalPages: number;

  @ApiProperty({ description: 'Current page number' })
  page?: number;

  @ApiProperty({ description: 'User per page number' })
  perPage?: number;

  @ApiProperty({ description: 'Users', type: [UserToReturn] })
  data: UserToReturn[];
}
