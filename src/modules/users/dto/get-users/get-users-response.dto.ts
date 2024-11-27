import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { UserToReturn } from '../../types';

export class GetUsersResponseDto extends PaginationResponseDto {
  @ApiProperty({ description: 'Users', type: [UserToReturn] })
  data: UserToReturn[];
}
