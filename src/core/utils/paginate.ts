import { SelectQueryBuilder } from 'typeorm';

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
      data: await query.offset(skippedItems).limit(perPage).getMany(),
    };
  }

  return {
    totalAmount: await query.getCount(),
    data: await query.getMany(),
  };
};
