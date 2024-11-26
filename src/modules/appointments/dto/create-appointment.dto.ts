import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceDto } from './service.dto';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Selected patient for an appointment' })
  @IsNumber()
  patientId: number;

  @ApiProperty({
    description: 'Selected services for an appointment',
    type: [ServiceDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];

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
