import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
} from '../constants/products';

export const addProduct = text => ({
  type: ADD_PRODUCT,
  text,
});

export const editProduct = ({ id, text, category }) => ({
  type: EDIT_PRODUCT,
  id,
  text,
  category,
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
