import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@core';

export class GetServicesFilterDto {
  @ApiProperty({ description: 'Name of the service', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Status of the service',
    required: false,
    enum: [Status.ACTIVE, Status.DISABLED],
  })
  @IsOptional()
  @IsIn([Status.ACTIVE, Status.DISABLED])
  status: Status;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({ description: 'Per page number', required: false })
  @IsOptional()
  @IsNumberString()
  perPage: number;
}
