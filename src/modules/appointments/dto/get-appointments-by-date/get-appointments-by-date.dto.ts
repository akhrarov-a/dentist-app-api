import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class GetAppointmentsByDateDto {
  @ApiProperty({
    description:
      'Date for which to retrieve appointments in "YYYY-MM-DD" format.',
  })
  @IsDateString()
  date: string;
}
