import React from 'react';
import { Route } from 'react-router-dom';

import Header from './Header';
import Shopping from './Shopping';
import Categories from './Categories';
import Share from './Share';
import Settings from './Settings';
import FetchUser from './FetchUser';

import '../styles/style.css';

const App = () => (
  <div>
    <Route path="/" component={Header} />
    <Route exact path="/" component={Shopping} />
    <Route path="/categories" component={Categories} />
    <Route path="/share" component={Share} />
    <Route path="/settings" component={Settings} />
    <FetchUser />
  </div>
);

export default App;
