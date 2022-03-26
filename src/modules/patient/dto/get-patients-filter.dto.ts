import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Get patients filter dto
 */
class GetPatientsFilterDto {
  /**
   * Search
   */
  @IsOptional()
  @IsNotEmpty()
  search: string;

  /**
   * Page
   */
  @IsOptional()
  @IsNotEmpty()
  page: number;

  /**
   * Per page
   */
  @IsOptional()
  @IsNotEmpty()
  perPage: number;
}

export { GetPatientsFilterDto };
