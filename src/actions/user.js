import { REQUEST_USER, RECIEVE_USER, LOGOUT_USER } from '../constants/user';

export const logoutUser = () => dispatch => {
  dispatch({ type: LOGOUT_USER });
  return fetch('/__/logout', { credentials: 'include' });
};

export const fetchUser = () => dispatch => {
  dispatch({ type: REQUEST_USER });
  return fetch('/__/user', { credentials: 'include' })
    .then(response => response.json())
    .then(user => dispatch({ type: RECIEVE_USER, user }));
};
