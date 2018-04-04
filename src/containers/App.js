import React from 'react';
import { Route } from 'react-router-dom';

import Header from './Header';
import LanguageSelector from './LanguageSelector';
import Shopping from './Shopping';
import Categories from './Categories';
import Share from './Share';
import Settings from './Settings';
import User from './User';

import '../styles/style.css';

const App = () => (
  <div>
    <Header />
    <LanguageSelector />
    <Route exact path="/" component={Shopping} />
    <Route path="/categories" component={Categories} />
    <Route path="/share" component={Share} />
    <Route path="/settings" component={Settings} />
    <User />
  </div>
);

export default App;
