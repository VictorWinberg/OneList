import { SET_VISIBILITY_FILTER } from '../constants';

const filter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter || state;
    default:
      return state;
  }
};

export default filter;
