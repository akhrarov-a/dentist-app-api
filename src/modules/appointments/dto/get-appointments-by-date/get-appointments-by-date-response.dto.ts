import { ApiProperty } from '@nestjs/swagger';
import { AppointmentToReturnDto } from '../appointment-to-return';

export class GetAppointmentsByDateResponseDto {
  @ApiProperty({ description: 'Date' })
  date: string;

  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentToReturnDto],
  })
  appointments: AppointmentToReturnDto[];
}
