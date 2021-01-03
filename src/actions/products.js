import { FETCH_PRODUCTS } from '../constants/products';

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
    }).then(() => dispatch(fetchProducts()))
      .catch(err => console.error(err));
  }
};

export const editProduct = ({ id, name, amount, unit, category }) => dispatch => {
  fetch(`/__/products/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, amount, unit, category: category || null }),
  }).then(() => dispatch(fetchProducts()))
    .catch(err => console.error(err));
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
  }).then(() => dispatch(fetchProducts()))
    .catch(err => console.error(err));
};

export const toggleProductInactive = id => dispatch => {
  fetch(`/__/products/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Type: "toggle-inactive",
    },
    credentials: "include",
  }).then(() => dispatch(fetchProducts()))
    .catch((err) => console.error(err));
};

export const removeProduct = id => dispatch => {
  fetch(`/__/products/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then(() => dispatch(fetchProducts()))
    .catch(err => console.error(err));
};

export const inactivateProducts = () => dispatch => {
  fetch('/__/products', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then(() => dispatch(fetchProducts()))
    .catch(err => console.error(err));
};

export const fetchProducts = () => dispatch =>
  fetch('/__/products', { credentials: 'include' })
    .then(response => response.json())
    .then(products => dispatch({ type: FETCH_PRODUCTS, products }))
    .catch(err => console.error(err));
