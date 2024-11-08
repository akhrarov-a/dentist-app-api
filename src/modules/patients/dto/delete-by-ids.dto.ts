import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteByIdsDto {
  @ApiProperty({ description: 'Patients ids to delete' })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ids: number[];
}
