import { combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';

import products from './products';
import categories from './categories';
import filter from './filter';
import user from './user';

export default combineReducers({
  locale: localeReducer,
  products,
  categories,
  filter,
  user,
});
