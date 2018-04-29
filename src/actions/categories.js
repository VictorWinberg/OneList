import {
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
} from '../constants/categories';

export const addCategory = text => ({
  type: ADD_CATEGORY,
  text,
});

export const editCategory = ({ id, text, color }) => ({
  type: EDIT_CATEGORY,
  id,
  text,
  color,
});

export const removeCategory = id => ({
  type: REMOVE_CATEGORY,
  id,
});
