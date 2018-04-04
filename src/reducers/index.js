import { combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';

import todos from './todos';
import filter from './filter';

export default combineReducers({
  locale: localeReducer,
  todos,
  filter,
});
