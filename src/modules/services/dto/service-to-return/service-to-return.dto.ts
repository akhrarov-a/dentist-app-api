import { ApiProperty } from '@nestjs/swagger';

export class ServiceToReturnDto {
  @ApiProperty({ description: 'The id of the service' })
  id: number;

  @ApiProperty({ description: 'The name of the service' })
  name: string;

  @ApiProperty({ description: 'Created date and time of the service' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date and time of the service' })
  updatedAt: Date;
}
