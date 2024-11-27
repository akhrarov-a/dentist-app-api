import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { ServiceEntity } from '../../service.entity';

export class GetServicesResponseDto extends PaginationResponseDto {
  @ApiProperty({ description: 'Services', type: [ServiceEntity] })
  data: ServiceEntity[];
}
