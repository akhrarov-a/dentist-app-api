import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@core';
import { AppointmentToReturnDto } from '../appointment-to-return';

export class GetAppointmentsResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: 'Appointments',
    type: [AppointmentToReturnDto],
  })
  data: AppointmentToReturnDto[];
}
