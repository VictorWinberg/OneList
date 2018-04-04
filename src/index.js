import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initialize, addTranslation } from 'react-localize-redux';

import App from './containers/App';
import reducers from './reducers';
import translation from './translation';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
store.dispatch(initialize(['en', 'sv'], { defaultLanguage: 'sv' }));
store.dispatch(addTranslation(translation));

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./containers/App').default;
    render(
      <Provider store={store}>
        <Router>
          <NextApp />
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  });
}
