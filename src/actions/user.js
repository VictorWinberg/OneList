import { REQUEST_USER, RECIEVE_USER } from '../constants/user';

export const requestUser = () => ({
  type: REQUEST_USER,
});

export const receiveUser = user => ({
  type: RECIEVE_USER,
  user,
});

export const fetchUser = () => dispatch => {
  dispatch(requestUser());
  return fetch('/__/user', { credentials: 'include' })
    .then(response => response.json())
    .then(json => dispatch(receiveUser(json)));
};
