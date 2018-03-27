import { ADD_TODO, TOGGLE_TODO } from '../constants/todos';

export const addTodo = text => ({
  type: ADD_TODO,
  text,
});

export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  id,
});
