import React from 'react';
import { Route } from 'react-router-dom';

import Header from '../components/Header';
import Shopping from './Shopping';
import Categories from './Categories';
import Share from './Share';
import Settings from './Settings';

const App = () => (
  <div>
    <Header />
    <Route exact path="/" component={Shopping} />
    <Route path="/categories" component={Categories} />
    <Route path="/share" component={Share} />
    <Route path="/settings" component={Settings} />
  </div>
);

export default App;
