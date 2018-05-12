import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
  FETCH_PRODUCTS,
} from '../constants/products';

export const addProduct = ({ name, category }) => dispatch => {
  fetch('/__/products', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, category }),
  }).catch(err => console.error(err));

  return dispatch({
    type: ADD_PRODUCT,
    name,
    category,
  });
};

export const editProduct = ({ id, name, category }) => dispatch => {
  fetch(`/__/products/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, category: category || null }),
  }).catch(err => console.error(err));

  return dispatch({
    type: EDIT_PRODUCT,
    id,
    name,
    category,
  });
};

export const toggleProduct = id => ({
  type: TOGGLE_PRODUCT,
  id,
});

export const removeProduct = id => dispatch => {
  fetch(`/__/products/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).catch(err => console.error(err));

  return dispatch({
    type: REMOVE_PRODUCT,
    id,
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
