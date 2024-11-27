import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientResponseDto {
  @ApiProperty({ description: 'The id of created patient' })
  id: number;
}
