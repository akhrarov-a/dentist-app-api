import { ApiProperty } from '@nestjs/swagger';
import { PatientEntity } from '@patients/patient.entity';

export class AppointmentResponseWithPatientDto {
  @ApiProperty({ description: 'ID of the appointment' })
  id: number;

  @ApiProperty({
    description: 'Selected patient for the appointment',
    type: PatientEntity,
  })
  patient: PatientEntity;

  @ApiProperty({ description: 'Start time of the appointment' })
  startTime: Date;

  @ApiProperty({ description: 'End time of the appointment' })
  endTime: Date;

  @ApiProperty({ description: 'Description of the appointment' })
  description: string;

  @ApiProperty({ description: 'Created at time of the appointment' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at time of the appointment' })
  updatedAt: Date;

  @ApiProperty({ description: 'The owner of the appointment' })
  userId: number;
}
