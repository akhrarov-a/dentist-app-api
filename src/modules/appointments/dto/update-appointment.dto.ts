import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Selected patient for an appointment',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  patientId: number;

  @ApiProperty({ description: 'Start time of an appointment', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time of an appointment', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({
    description: 'Description of an appointment',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
}
