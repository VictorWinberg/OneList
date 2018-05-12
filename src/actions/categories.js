import {
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
  REORDER_CATEGORY,
  FETCH_CATEGORIES,
} from '../constants/categories';

export const addCategory = ({ name }) => ({
  type: ADD_CATEGORY,
  name,
});

export const editCategory = ({ id, name, color }) => ({
  type: EDIT_CATEGORY,
  id,
  name,
  color,
});

export const removeCategory = id => ({
  type: REMOVE_CATEGORY,
  id,
});

export const reorderCategory = ({ startIndex, endIndex }) => ({
  type: REORDER_CATEGORY,
  startIndex,
  endIndex,
});

export const fetchCategories = () => dispatch =>
  fetch('/__/categories', { credentials: 'include' })
    .then(response => response.json())
    .then(categories => dispatch({ type: FETCH_CATEGORIES, categories }))
    .catch(err => console.error(err));
