import { IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAppointmentsByPatientDto {
  @ApiProperty({ description: 'Patient id' })
  @IsNumberString()
  patient: number;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({ description: 'Per page number', required: false })
  @IsOptional()
  @IsNumberString()
  perPage: number;
}
