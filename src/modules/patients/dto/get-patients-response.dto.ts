import { ApiProperty } from '@nestjs/swagger';
import { PatientEntity } from '../patient.entity';

export class GetPatientsResponseDto {
  @ApiProperty({ description: 'Total patients number' })
  totalPatients: number;

  @ApiProperty({ description: 'Total pages number' })
  totalPages: number;

  @ApiProperty({ description: 'Current page number' })
  page?: number;

  @ApiProperty({ description: 'Patient per page number' })
  perPage?: number;

  @ApiProperty({ description: 'Users', type: [PatientEntity] })
  data: PatientEntity[];
}
