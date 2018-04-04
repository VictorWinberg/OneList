import { combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';

import todos from './todos';
import filter from './filter';
import user from './user';

export default combineReducers({
  locale: localeReducer,
  todos,
  filter,
  user,
});
