import { ApiProperty } from '@nestjs/swagger';
import { ServiceToReturnDto } from '@services/dto';
import { AppointmentToReturnDto } from '../appointment-to-return';

export class AppointmentServiceToReturnDto {
  @ApiProperty({ description: 'The id of the appointment_service' })
  id: number;

  appointment: AppointmentToReturnDto;

  @ApiProperty({ description: 'The service of the appointment_service' })
  service: ServiceToReturnDto;

  @ApiProperty({ description: 'The description of the appointment_service' })
  description: string;
}
