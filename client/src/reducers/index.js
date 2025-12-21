import { combineReducers } from 'redux';

import products from './products';
import categories from './categories';
import user from './user';
import shoppingHistory from './shoppingHistory';

export default combineReducers({
  products,
  categories,
  user,
  shoppingHistory,
});
