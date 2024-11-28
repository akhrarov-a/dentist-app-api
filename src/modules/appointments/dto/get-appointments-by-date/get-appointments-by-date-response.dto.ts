import { ApiProperty } from '@nestjs/swagger';
import { DateType } from '../../types';
import { AppointmentToReturnDto } from '../appointment-to-return';

class AppointmentsDto {
  @ApiProperty({ description: 'Date' })
  date: string;

  @ApiProperty({
    description: 'Appointments of this date',
    type: [AppointmentToReturnDto],
  })
  appointments: AppointmentToReturnDto[];
}

export class GetAppointmentsByDateResponseDto {
  @ApiProperty({ description: 'Date' })
  date: string;

  @ApiProperty({ description: 'Date type', enum: DateType })
  type: DateType;

  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentsDto],
  })
  appointments: AppointmentsDto[];
}
