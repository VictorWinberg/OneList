import { omit } from 'lodash/fp';

import {
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
} from '../constants/categories';

let categoryIndex = 0;

const categories = (state = [], action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      if (!action.text) return state;
      categoryIndex += 1;
      return [
        ...state,
        {
          id: categoryIndex,
          text: action.text,
        },
      ];
    case EDIT_CATEGORY:
      return state.map(
        category =>
          category.id === action.id ? omit('type', action) : category
      );
    case REMOVE_CATEGORY:
      return state.filter(category => category.id !== action.id);
    default:
      return state;
  }
};

export default categories;
