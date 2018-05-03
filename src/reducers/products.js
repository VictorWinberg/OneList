import { find, omit } from 'lodash/fp';

import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
} from '../constants/products';

let productIndex = 0;

const products = (state = [], action) => {
  switch (action.type) {
    case ADD_PRODUCT: {
      const { name, category } = action;
      if (!name) return state;
      const exists = find({ name }, state);
      if (exists) {
        return [
          ...state.filter(product => product.id !== exists.id),
          {
            ...exists,
            active: true,
            checked: false,
          },
        ];
      }

      productIndex += 1;
      return [
        ...state,
        {
          id: productIndex,
          name,
          category,
          active: true,
          checked: false,
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
    case REMOVE_PRODUCTS:
      return state.map(
        product => (product.checked ? { ...product, active: false } : product)
      );
    default:
      return state;
  }
};

export default products;
