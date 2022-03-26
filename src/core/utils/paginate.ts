import { SelectQueryBuilder } from 'typeorm';

/**
 * Paginate
 */
const paginate = async <T>(
  query: SelectQueryBuilder<T>,
  page: number,
  perPage: number,
): Promise<{ total: number; data: T[] }> => {
  if (page && perPage) {
    const totalCount = await query.getCount();

    const skippedItems = (page - 1) * perPage;

    return {
      total: Math.floor(
        Number.isInteger(totalCount / perPage)
          ? totalCount / perPage
          : totalCount / perPage + 1,
      ),
      data: await query.offset(skippedItems).limit(perPage).getMany(),
    };
  }

  return {
    total: await query.getCount(),
    data: await query.getMany(),
  };
};

export { paginate };
