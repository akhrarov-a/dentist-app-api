import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn } from 'class-validator';
import { DateType } from '../../types';

export class GetAppointmentsByDateDto {
  @ApiProperty({
    description:
      'Date for which to retrieve appointments in "YYYY-MM-DD" format.',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Date type', enum: DateType })
  @IsIn([DateType.DAY, DateType.WEEK])
  type: DateType;
}
