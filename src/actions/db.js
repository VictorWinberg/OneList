import { REMOVE_DB_PRODUCT, REMOVE_DB_CATEGORY } from '../constants/db';

export const removeProduct = name => ({
  type: REMOVE_DB_PRODUCT,
  name,
});

export const removeCategory = name => ({
  type: REMOVE_DB_CATEGORY,
  name,
});
