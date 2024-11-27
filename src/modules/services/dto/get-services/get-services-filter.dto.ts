import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@core';

export class GetServicesFilterDto extends PaginationDto {
  @ApiProperty({ description: 'Name of the service', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}
