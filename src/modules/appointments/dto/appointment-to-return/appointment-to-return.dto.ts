import { ApiProperty } from '@nestjs/swagger';
import { PatientToReturnDto } from '@patients/dto';
import { AppointmentServiceToReturnDto } from '../appointment-service-to-return';

export class AppointmentToReturnDto {
  @ApiProperty({ description: 'The id of the appointment' })
  id: number;

  @ApiProperty({ description: 'Start time of the appointment' })
  startTime: Date;

  @ApiProperty({ description: 'End time of the appointment' })
  endTime: Date;

  @ApiProperty({
    description: 'Description of the appointment',
    nullable: true,
  })
  description: string;

  @ApiProperty({ description: 'Created at time of the appointment' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at time of the appointment' })
  updatedAt: Date;

  @ApiProperty({ description: 'Patient of the appointment' })
  patient: PatientToReturnDto;

  @ApiProperty({
    description: 'Services of the appointment',
    type: [AppointmentServiceToReturnDto],
  })
  appointmentServices: AppointmentServiceToReturnDto[];
}
