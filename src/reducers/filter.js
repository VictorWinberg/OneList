import { SET_VISIBILITY_FILTER } from '../constants/todos';
import { SHOW_ALL } from '../constants/filter';

const filter = (state = SHOW_ALL, action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter || state;
    default:
      return state;
  }
};

export default filter;
