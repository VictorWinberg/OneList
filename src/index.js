import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './index.css';
import App from './App';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers);

render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(<Provider store={store}><NextApp /></Provider>, document.getElementById('root'));
  });
}
