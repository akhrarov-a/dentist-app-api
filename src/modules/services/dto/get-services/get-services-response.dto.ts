import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { ServiceToReturnDto } from '../service-to-return';

export class GetServicesResponseDto extends PaginationResponseDto {
  @ApiProperty({ description: 'Services', type: [ServiceToReturnDto] })
  data: ServiceToReturnDto[];
}
