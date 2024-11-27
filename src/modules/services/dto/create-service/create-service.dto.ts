import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'Name of the service' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
