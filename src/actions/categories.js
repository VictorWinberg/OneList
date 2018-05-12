import {
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
  REORDER_CATEGORY,
  FETCH_CATEGORIES,
} from '../constants/categories';

export const addCategory = ({ name }) => dispatch => {
  if (name) {
    fetch('/__/categories', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name }),
    }).catch(err => console.error(err));
  }

  return dispatch({
    type: ADD_CATEGORY,
    name,
  });
};

export const editCategory = ({ id, name, color }) => dispatch => {
  fetch(`/__/categories/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, color }),
  }).catch(err => console.error(err));

  return dispatch({
    type: EDIT_CATEGORY,
    id,
    name,
    color,
  });
};

export const removeCategory = id => dispatch => {
  fetch(`/__/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).catch(err => console.error(err));

  return dispatch({
    type: REMOVE_CATEGORY,
    id,
  });
};

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
