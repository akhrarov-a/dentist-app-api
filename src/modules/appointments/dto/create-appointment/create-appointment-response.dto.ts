import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentResponseDto {
  @ApiProperty({ description: 'The id of created appointment' })
  id: number;
}
