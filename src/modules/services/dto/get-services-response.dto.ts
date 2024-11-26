import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '@core';
import { ServiceEntity } from '../service.entity';

export class GetServicesResponseDto extends Pagination {
  @ApiProperty({ description: 'Users', type: [ServiceEntity] })
  data: ServiceEntity[];
}
