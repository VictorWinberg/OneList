import { getOr, maxBy, find, omit } from 'lodash/fp';

import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  INACTIVATE_PRODUCTS,
  FETCH_PRODUCTS,
} from '../constants/products';

const products = (state = [], action) => {
  switch (action.type) {
    case ADD_PRODUCT: {
      const { name, category } = action;
      if (!name) return state;
      const exists = find({ name }, state);
      if (exists) {
        return [
          ...state.filter(product => product.id !== exists.id),
          { ...exists, inactive: false, checked: false },
        ];
      }

      return [
        ...state,
        {
          id: 1 + getOr(0, 'id', maxBy('id', state)),
          name,
          category,
        },
      ];
    }
    case EDIT_PRODUCT:
      return state.map(product => ({
        ...product,
        ...(product.id === action.id ? omit('type', action) : {}),
      }));
    case TOGGLE_PRODUCT: {
      const toggled = state.filter(product => product.id === action.id)[0];
      return [
        ...state.filter(product => product.id !== action.id),
        {
          ...toggled,
          checked: !toggled.checked,
        },
      ];
    }
    case REMOVE_PRODUCT:
      return state.filter(product => product.id !== action.id);
    case INACTIVATE_PRODUCTS:
      return state.map(
        product => (product.checked ? { ...product, inactive: true } : product)
      );
    case FETCH_PRODUCTS:
      return action.products;
    default:
      return state;
  }
};

export default products;
