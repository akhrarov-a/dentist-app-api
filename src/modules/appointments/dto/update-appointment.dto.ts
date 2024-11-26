import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceDto } from './service.dto';

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Selected patient for an appointment',
    required: false,
  })
  @IsOptional()
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
  @IsOptional()
  services: ServiceDto[];

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
