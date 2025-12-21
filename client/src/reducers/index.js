import { combineReducers } from 'redux';

import products from './products';
import categories from './categories';
import user from './user';
import history from './history';

export default combineReducers({
  products,
  categories,
  user,
  history,
});
