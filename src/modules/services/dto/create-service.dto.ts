import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@core';

export class CreateServiceDto {
  @ApiProperty({ description: 'Name of the service' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Status of the service',
    enum: [Status.ACTIVE, Status.DISABLED],
  })
  @IsIn([Status.ACTIVE, Status.DISABLED])
  status: Status;
}
