import {
  UPDATE_USER,
  SUBMIT_USER,
  REQUEST_USER,
  RECIEVE_USER,
  TOGGLE_COLLABORATION,
  LOGOUT_USER,
} from '../constants/user';

const initialState = {
  isFetching: false,
  isSubmitting: false,
  isCollaboration: true,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, [action.key]: action.value };
    case SUBMIT_USER:
      return { ...state, isSubmitting: true };
    case REQUEST_USER:
      return { ...state, isFetching: true };
    case RECIEVE_USER:
      return {
        ...state,
        ...action.user,
        isFetching: false,
        isSubmitting: false,
      };
    case TOGGLE_COLLABORATION:
      return { ...state, isCollaboration: !state.isCollaboration };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default user;
