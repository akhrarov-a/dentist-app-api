import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty({ description: 'ID of the service' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Description of the service', required: false })
  @IsString()
  @IsOptional()
  description: string;
}
