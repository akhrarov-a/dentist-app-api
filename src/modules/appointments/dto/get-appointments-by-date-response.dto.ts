import { ApiProperty } from '@nestjs/swagger';
import { AppointmentResponseWithPatientDto } from './appointment-response-with-patient.dto';

export class GetAppointmentsByDateResponseDto {
  @ApiProperty({ description: 'Selected date' })
  date: string;

  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentResponseWithPatientDto],
  })
  appointments: AppointmentResponseWithPatientDto[];
}
