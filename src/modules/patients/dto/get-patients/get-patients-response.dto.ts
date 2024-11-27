import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { PatientEntity } from '../../patient.entity';

export class GetPatientsResponseDto extends PaginationResponseDto {
  @ApiProperty({ description: 'Patients', type: [PatientEntity] })
  data: PatientEntity[];
}
