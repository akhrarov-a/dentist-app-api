import { ApiProperty } from '@nestjs/swagger';
import { Language, UserRole } from '@core';

export class GetCurrentUserResponseDto {
  @ApiProperty({ description: 'ID of the user' })
  id: number;

  @ApiProperty({ description: 'Firstname of the user' })
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user' })
  lastname: string;

  @ApiProperty({ description: 'Phone of the user' })
  phone: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({ description: 'Layout title of the user' })
  layoutTitle: string;

  @ApiProperty({ description: 'Language of the user', enum: Language })
  language: Language;

  @ApiProperty({ description: 'Holidays of the user', required: false })
  holidays: string[];

  @ApiProperty({ description: 'Weekends of the user', required: false })
  weekends: number[];

  @ApiProperty({ description: 'Working hours of the user', required: false })
  workingHours: string;
}
