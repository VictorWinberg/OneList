import {
  UPDATE_USER,
  SUBMIT_USER,
  REQUEST_USER,
  RECIEVE_USER,
  LOGOUT_USER,
} from '../constants/user';

export const updateUser = ({ target }) => ({
  type: UPDATE_USER,
  key: target.id,
  value: target.value,
});

export const submitUser = event => dispatch => {
  event.preventDefault();
  dispatch({ type: SUBMIT_USER });
};

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
