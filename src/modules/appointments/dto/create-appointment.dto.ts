import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Selected patient for an appointment' })
  @IsNumber()
  patientId: number;

  @ApiProperty({ description: 'Start time of an appointment' })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'End time of an appointment' })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Description of an appointment',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
}
