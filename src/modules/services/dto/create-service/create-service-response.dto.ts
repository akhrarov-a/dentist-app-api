import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceResponseDto {
  @ApiProperty({ description: 'The id of created service' })
  id: number;
}
