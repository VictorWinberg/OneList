import {
  REORDER_CATEGORY,
  FETCH_CATEGORIES,
} from '../constants/categories';

export const addCategory = ({ name }, next) => async dispatch => {
  let json = {};
  if (name) {
    try {
      const res = await fetch("/__/categories", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      json = await res.json();
      if (next) await next(json);
      return await dispatch(fetchCategories());
    } catch (err) {
     console.error(err); 
    }
  }
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
  }).then(() => dispatch(fetchCategories()))
    .catch(err => console.error(err));
};

export const removeCategory = id => dispatch => {
  fetch(`/__/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then(() => dispatch(fetchCategories()))
    .catch(err => console.error(err));
};

export const reorderCategory = ({ startIndex, endIndex }) => dispatch => {
  fetch('/__/categories_reorder', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ startIndex, endIndex }),
  }).then(() => dispatch(fetchCategories()))
    .catch(err => console.error(err));

  return dispatch({
    type: REORDER_CATEGORY,
    startIndex,
    endIndex,
  });
};

export const fetchCategories = () => dispatch =>
  fetch('/__/categories', { credentials: 'include' })
    .then(response => response.json())
    .then(categories => dispatch({ type: FETCH_CATEGORIES, categories }))
    .catch(err => console.error(err));
