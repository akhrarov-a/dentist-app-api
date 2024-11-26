import { ApiProperty } from '@nestjs/swagger';
import { AppointmentResponseWithPatientDto } from './appointment-response-with-patient.dto';

export class GetAppointmentsByPatientResponseDto {
  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentResponseWithPatientDto],
  })
  appointments: AppointmentResponseWithPatientDto[];
}
