import {
  ADD_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
} from '../constants/products';

let productIndex = 0;

const products = (state = [], action) => {
  switch (action.type) {
    case ADD_PRODUCT:
      productIndex += 1;
      return [
        ...state,
        {
          id: productIndex,
          text: action.text,
          completed: false,
        },
      ];
    case TOGGLE_PRODUCT: {
      const toggled = state.filter(product => product.id === action.id)[0];
      return [
        ...state.filter(product => product.id !== action.id),
        {
          ...toggled,
          completed: !toggled.completed,
        },
      ];
    }
    case REMOVE_PRODUCT:
      return state.filter(product => product.id !== action.id);
    case REMOVE_PRODUCTS:
      return state.filter(product => !product.completed);
    default:
      return state;
  }
};

export default products;