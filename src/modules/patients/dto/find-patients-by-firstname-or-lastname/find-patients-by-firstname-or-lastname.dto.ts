import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindPatientsByFirstnameOrLastnameDto {
  @ApiProperty({ description: 'Search parameter: firstname or lastname' })
  @IsString()
  @IsNotEmpty()
  search: string;
}
