import { SelectQueryBuilder } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({ description: 'Per page number', required: false })
  @IsOptional()
  @IsNumberString()
  perPage: number;
}

export class PaginationResponseDto {
  @ApiProperty({ description: 'Total patients number' })
  totalAmount: number;

  @ApiProperty({ description: 'Total pages number' })
  totalPages: number;

  @ApiProperty({ description: 'Current page number' })
  page?: number;

  @ApiProperty({ description: 'Per page number' })
  perPage?: number;
}

export const paginate = async <T>({
  query,
  page,
  perPage,
}: {
  query: SelectQueryBuilder<T>;
  page: number;
  perPage: number;
}): Promise<{ totalAmount: number; totalPages?: number; data: T[] }> => {
  if (page && perPage) {
    const totalCount = await query.getCount();

    const skippedItems = (page - 1) * perPage;

    return {
      totalAmount: totalCount,
      totalPages: Math.floor(
        Number.isInteger(totalCount / perPage)
          ? totalCount / perPage
          : totalCount / perPage + 1,
      ),
      data: await query.skip(skippedItems).take(perPage).getMany(),
    };
  }

  return {
    totalAmount: await query.getCount(),
    data: await query.getMany(),
  };
};
