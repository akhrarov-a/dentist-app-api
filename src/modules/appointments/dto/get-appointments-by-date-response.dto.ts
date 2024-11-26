import { ApiProperty } from '@nestjs/swagger';
import { AppointmentResponseWithPatientAndServiceDto } from './appointment-response-with-patient-and-service.dto';

export class GetAppointmentsByDateResponseDto {
  @ApiProperty({ description: 'Selected date' })
  date: string;

  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentResponseWithPatientAndServiceDto],
  })
  appointments: AppointmentResponseWithPatientAndServiceDto[];
}
