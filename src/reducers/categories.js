import { sortBy } from 'lodash/fp';

import {
  REORDER_CATEGORY,
  FETCH_CATEGORIES,
} from '../constants/categories';

const categories = (state = [], action) => {
  switch (action.type) {
    case REORDER_CATEGORY: {
      const { startIndex, endIndex } = action;

      const newState = [...state].map(item => {
        // REPLACE
        if (item.orderidx === startIndex) {
          return { ...item, orderidx: endIndex };
        }
        // MOVE UP
        if (
          startIndex - endIndex > 0 &&
          item.orderidx < startIndex &&
          item.orderidx >= endIndex
        ) {
          return { ...item, orderidx: item.orderidx + 1 };
        }
        // MOVE DOWN
        if (
          startIndex - endIndex < 0 &&
          item.orderidx > startIndex &&
          item.orderidx <= endIndex
        ) {
          return { ...item, orderidx: item.orderidx - 1 };
        }

        return item;
      });

      return sortBy('orderidx', newState);
    }
    case FETCH_CATEGORIES:
      return sortBy('orderidx', action.categories);
    default:
      return state;
  }
};

export default categories;
