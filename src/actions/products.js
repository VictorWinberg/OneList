import {
  ADD_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
} from '../constants/products';

export const addProduct = text => ({
  type: ADD_PRODUCT,
  text,
});

export const toggleProduct = id => ({
  type: TOGGLE_PRODUCT,
  id,
});

export const removeProduct = id => ({
  type: REMOVE_PRODUCT,
  id,
});

export const removeProducts = () => ({
  type: REMOVE_PRODUCTS,
});
