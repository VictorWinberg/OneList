import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './containers/App';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const store = createStore(reducers, composeWithDevTools());

render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default;
    render(<Provider store={store}><NextApp /></Provider>, document.getElementById('root'));
  });
}
