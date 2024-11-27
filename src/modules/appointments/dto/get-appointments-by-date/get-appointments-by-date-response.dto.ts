import { ApiProperty } from '@nestjs/swagger';
import { AppointmentEntity } from '../../appointment.entity';

export class GetAppointmentsByDateResponseDto {
  @ApiProperty({ description: 'Date' })
  date: string;

  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentEntity],
  })
  appointments: AppointmentEntity[];
}
