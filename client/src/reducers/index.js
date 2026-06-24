import { combineReducers } from 'redux';

import products from './products';
import categories from './categories';
import stores from './stores';
import user from './user';
import history from './history';

export default combineReducers({
  products,
  categories,
  stores,
  user,
  history,
});
