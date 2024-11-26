import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@core';

export class UpdateServiceByIdDto {
  @ApiProperty({ description: 'Name of the service', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Status of the service',
    enum: [Status.ACTIVE, Status.DISABLED],
    required: false,
  })
  @IsOptional()
  @IsIn([Status.ACTIVE, Status.DISABLED])
  status: Status;
}
