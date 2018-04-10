import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

const Root = (App, store) => (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

export default Root;
