import { ADD_CATEGORY, REMOVE_CATEGORY } from '../constants/categories';

export const addCategory = text => ({
  type: ADD_CATEGORY,
  text,
});

export const removeCategory = id => ({
  type: REMOVE_CATEGORY,
  id,
});
