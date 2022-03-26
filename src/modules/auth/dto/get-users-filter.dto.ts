import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Get users filter dto
 */
class GetUsersFilterDto {
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

export { GetUsersFilterDto };
