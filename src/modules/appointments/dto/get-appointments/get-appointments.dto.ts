import { IsNumberString, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@core';

export class GetAppointmentsDto extends PaginationDto {
  @ApiProperty({ description: 'Patient id' })
  @IsOptional()
  @ValidateIf((dto) => !dto.service, {
    message: 'Patient or service id is required',
  })
  @IsNumberString()
  patient: number;

  @ApiProperty({ description: 'Service id' })
  @IsOptional()
  @ValidateIf((dto) => !dto.patient, {
    message: 'Patient or service id is required',
  })
  @IsNumberString()
  service: number;
}
