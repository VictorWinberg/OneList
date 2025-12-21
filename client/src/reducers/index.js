import { combineReducers } from 'redux';

import products from './products';
import categories from './categories';
import user from './user';

export default combineReducers({
  products,
  categories,
  user,
});
