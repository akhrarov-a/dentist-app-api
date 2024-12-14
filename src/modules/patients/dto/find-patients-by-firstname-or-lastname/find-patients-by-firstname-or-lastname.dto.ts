import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindPatientsByFirstnameOrLastnameOrPhoneDto {
  @ApiProperty({
    description: 'Search parameter: firstname or lastname or phone',
  })
  @IsString()
  @IsNotEmpty()
  search: string;
}
