import { ApiProperty } from '@nestjs/swagger';
import { Language, Status, UserRole } from '@core';

export class UserToReturn {
  @ApiProperty({ description: 'ID of the user' })
  id: number;

  @ApiProperty({ description: 'Firstname of the user' })
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user' })
  lastname: string;

  @ApiProperty({ description: 'Description of the user' })
  description: string;

  @ApiProperty({ description: 'Phone of the user' })
  phone: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Language of the user', enum: Language })
  language: Language;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Status of the user',
    enum: Status,
  })
  status: string;

  @ApiProperty({ description: 'Layout title of the user' })
  layoutTitle: string;

  @ApiProperty({ description: 'Created date and time of the user' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date and time of the user' })
  updatedAt: Date;
}
