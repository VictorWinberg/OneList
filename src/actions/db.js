import { REMOVE_DB_PRODUCT, REMOVE_DB_CATEGORY } from '../constants/db';

export const removeProduct = name => ({
  type: REMOVE_DB_PRODUCT,
  name,
});

export const removeCategory = name => ({
  type: REMOVE_DB_CATEGORY,
  name,
});

export const fetchProducts = () => dispatch =>
  fetch('/__/products', { credentials: 'include' })
    .then(response => response.json())
    .then(products => console.log('FETCHED products:', products))
    .catch(err => console.error(err));

export const fetchCategories = () => dispatch =>
  fetch('/__/categories', { credentials: 'include' })
    .then(response => response.json())
    .then(categories => console.log('FETCHED categories:', categories))
    .catch(err => console.error(err));
