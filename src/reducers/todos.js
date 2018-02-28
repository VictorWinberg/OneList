import { ADD_TODO, TOGGLE_TODO } from '../constants/todos';

let todoIndex = 0;

const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      todoIndex += 1;
      return [
        ...state,
        {
          id: todoIndex,
          text: action.text,
          completed: false,
        },
      ];
    case TOGGLE_TODO:
      return state.map((todo) => {
        if (todo.id === action.id) {
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
