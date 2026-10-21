import { RESTOCK_FILTER_TOP_N } from '../constants/products';

export const selectRestockProductNames = (state) =>
  new Set(
    (state.history.productRestockPredictions || [])
      .slice(0, RESTOCK_FILTER_TOP_N)
      .map(({ name }) => name.toLowerCase())
  );
