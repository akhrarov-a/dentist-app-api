import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '@core';
import { PatientEntity } from '../patient.entity';

export class GetPatientsResponseDto extends Pagination {
  @ApiProperty({ description: 'Users', type: [PatientEntity] })
  data: PatientEntity[];
}
