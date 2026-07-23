import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import ErrorBoundary from '../components/ErrorBoundary';

const Root = (App, store) => (
  <Provider store={store}>
    <Router>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Router>
  </Provider>
);

export default Root;
