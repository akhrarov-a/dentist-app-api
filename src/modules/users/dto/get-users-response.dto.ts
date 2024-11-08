import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '@core';
import { UserToReturn } from '../types';

export class GetUsersResponseDto extends Pagination {
  @ApiProperty({ description: 'Users', type: [UserToReturn] })
  data: UserToReturn[];
}
