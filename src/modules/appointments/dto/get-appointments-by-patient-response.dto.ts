import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '@core';
import { AppointmentResponseWithPatientAndServiceDto } from './appointment-response-with-patient-and-service.dto';

export class GetAppointmentsByPatientResponseDto extends Pagination {
  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentResponseWithPatientAndServiceDto],
  })
  data: AppointmentResponseWithPatientAndServiceDto[];
}
