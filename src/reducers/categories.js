import { getOr, maxBy, omit } from 'lodash/fp';

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
      const newState = [...state];
      const [removed] = newState.splice(startIndex, 1);
      newState.splice(endIndex, 0, removed);

      return newState.map((category, i) => ({ ...category, at: i }));
    }
    case FETCH_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
};

export default categories;
