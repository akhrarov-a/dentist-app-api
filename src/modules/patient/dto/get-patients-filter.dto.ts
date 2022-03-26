import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Get patients filter dto
 */
class GetPatientsFilterDto {
  /**
   * Search
   */
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsNotEmpty()
  search: string;

  /**
   * Page
   */
  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNotEmpty()
  page: number;

  /**
   * Per page
   */
  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNotEmpty()
  perPage: number;
}

export { GetPatientsFilterDto };
