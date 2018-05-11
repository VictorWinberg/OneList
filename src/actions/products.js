import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
} from '../constants/products';

export const addProduct = ({ name, category }) => ({
  type: ADD_PRODUCT,
  name,
  category: category || '',
});

export const editProduct = ({ id, name, category }) => ({
  type: EDIT_PRODUCT,
  id,
  name,
  category: category || '',
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
