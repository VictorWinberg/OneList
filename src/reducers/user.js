import { REQUEST_USER, RECIEVE_USER } from '../constants/user';

const initialState = {
  isFetching: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_USER:
      return { ...state, isFetching: true };
    case RECIEVE_USER:
      return { ...state, ...action.user, isFetching: false };
    default:
      return state;
  }
};

export default user;