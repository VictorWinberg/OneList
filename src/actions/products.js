import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  TOGGLE_PRODUCT_CHECKED,
  TOGGLE_PRODUCT_INACTIVE,
  REMOVE_PRODUCT,
  INACTIVATE_PRODUCTS,
  FETCH_PRODUCTS,
} from '../constants/products';

export const addProduct = ({ name, category }) => dispatch => {
  if (name) {
    fetch('/__/products', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, category }),
    }).catch(err => console.error(err));
  }

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

export const toggleProductChecked = id => dispatch => {
  fetch(`/__/products/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Type: 'toggle-checked',
    },
    credentials: 'include',
  }).catch(err => console.error(err));

  return dispatch({
    type: TOGGLE_PRODUCT_CHECKED,
    id,
  });
};

export const toggleProductInactive = id => dispatch => {
  fetch(`/__/products/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Type: 'toggle-inactive',
    },
    credentials: 'include',
  }).catch(err => console.error(err));

  return dispatch({
    type: TOGGLE_PRODUCT_INACTIVE,
    id,
  });
};

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

export const inactivateProducts = () => dispatch => {
  fetch('/__/products', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).catch(err => console.error(err));

  return dispatch({
    type: INACTIVATE_PRODUCTS,
  });
};

export const fetchProducts = () => dispatch =>
  fetch('/__/products', { credentials: 'include' })
    .then(response => response.json())
    .then(products => dispatch({ type: FETCH_PRODUCTS, products }))
    .catch(err => console.error(err));
