import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';
import { fetchUser } from './actions/user';
import './i18n';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
store.dispatch(fetchUser());

export default store;
