import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { AppointmentEntity } from '../../appointment.entity';

export class GetAppointmentsResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentEntity],
  })
  data: AppointmentEntity[];
}
