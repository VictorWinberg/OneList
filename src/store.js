import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initialize, addTranslation } from 'react-localize-redux';

import reducers from './reducers';
import translation from './translation';
import { fetchUser } from './actions/user';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
store.dispatch(initialize(['en', 'sv']));
store.dispatch(addTranslation(translation));
store.dispatch(fetchUser());

export default store;
