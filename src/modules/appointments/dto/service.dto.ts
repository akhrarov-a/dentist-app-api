import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ServiceDto {
  @ApiProperty({ description: 'ID of the service' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Description of the service' })
  @IsString()
  description: string;
}
