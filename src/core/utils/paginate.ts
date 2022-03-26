import { SelectQueryBuilder } from 'typeorm';

/**
 * Paginate
 */
const paginate = async <T>(
  query: SelectQueryBuilder<T>,
  page: number,
  perPage: number,
) => {
  const totalCount = await query.getCount();

  const total = Math.floor(
    Number.isInteger(totalCount / perPage)
      ? totalCount / perPage
      : totalCount / perPage + 1,
  );

  const skippedItems = (page - 1) * perPage;
  const data = await query.offset(skippedItems).limit(perPage).getMany();

  return {
    total,
    data,
  };
};

export { paginate };
