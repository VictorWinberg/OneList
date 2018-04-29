import {
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
} from '../constants/categories';

export const addCategory = name => ({
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
