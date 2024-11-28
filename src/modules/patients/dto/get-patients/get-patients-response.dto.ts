import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { PatientToReturnDto } from '../patient-to-return';

export class GetPatientsResponseDto extends PaginationResponseDto {
  @ApiProperty({ description: 'Patients', type: [PatientToReturnDto] })
  data: PatientToReturnDto[];
}
