import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Selected patient for an appointment' })
  @IsNumber()
  patientId: number;

  @ApiProperty({ description: 'Selected service for an appointment' })
  @IsNumber()
  serviceId: number;

  @ApiProperty({ description: 'Start time of an appointment' })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time of an appointment' })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'Description of an appointment' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
