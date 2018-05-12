import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
  FETCH_PRODUCTS,
} from '../constants/products';

export const addProduct = ({ name, category }) => dispatch => {
  dispatch({
    type: ADD_PRODUCT,
    name,
    category,
  });
  return fetch('/__/products', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, category }),
  });
};

export const editProduct = ({ id, name, category }) => dispatch => {
  dispatch({
    type: EDIT_PRODUCT,
    id,
    name,
    category,
  });
  return fetch(`/__/products/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, category: category || null }),
  });
};

export const toggleProduct = id => ({
  type: TOGGLE_PRODUCT,
  id,
});

export const removeProduct = id => dispatch => {
  dispatch({
    type: REMOVE_PRODUCT,
    id,
  });
  return fetch(`/__/products/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};

export const removeProducts = () => ({
  type: REMOVE_PRODUCTS,
});

export const fetchProducts = () => dispatch =>
  fetch('/__/products', { credentials: 'include' })
    .then(response => response.json())
    .then(products => dispatch({ type: FETCH_PRODUCTS, products }))
    .catch(err => console.error(err));
