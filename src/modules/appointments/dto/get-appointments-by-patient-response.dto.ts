import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '@core';
import { AppointmentResponseWithPatientDto } from './appointment-response-with-patient.dto';

export class GetAppointmentsByPatientResponseDto extends Pagination {
  @ApiProperty({
    description: 'Users',
    type: [AppointmentResponseWithPatientDto],
  })
  data: AppointmentResponseWithPatientDto[];
}
