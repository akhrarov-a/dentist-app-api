import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { Status } from '@core';

export class PatientToReturnDto {
  @ApiProperty({ description: 'The id of the patient' })
  id: number;

  @ApiProperty({ description: 'The firstname of the patient' })
  firstname: string;

  @ApiProperty({ description: 'The lastname of the patient', required: false })
  lastname: string;

  @ApiProperty({ description: 'The phone of the patient' })
  phone: string;

  @ApiProperty({ description: 'The email of the patient' })
  email: string;

  @ApiProperty({
    description: 'The description of the patient',
    required: false,
  })
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @ApiProperty({ description: 'Created date and time of the patient' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date and time of the patient' })
  updatedAt: Date;
}
