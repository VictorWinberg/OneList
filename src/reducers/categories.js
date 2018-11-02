import { getOr, maxBy, omit, sortBy } from 'lodash/fp';

import {
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
  REORDER_CATEGORY,
  FETCH_CATEGORIES,
} from '../constants/categories';

const categories = (state = [], action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      if (!action.name) return state;
      return [
        ...state,
        {
          id: 1 + getOr(0, 'id', maxBy('id', state)),
          name: action.name,
        },
      ];
    case EDIT_CATEGORY:
      return state.map(category => ({
        ...category,
        ...(category.id === action.id ? omit('type', action) : {}),
      }));
    case REMOVE_CATEGORY:
      return state.filter(category => category.id !== action.id);
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
