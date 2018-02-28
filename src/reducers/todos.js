import { ADD_TODO, TOGGLE_TODO } from '../constants';

const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false,
        },
      ];
    case TOGGLE_TODO:
      return state.map((todo, i) => {
        if (i === action.id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      });
    default:
      return state;
  }
};

export default todos;
