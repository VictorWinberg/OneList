import React from 'react';
import { Route } from 'react-router-dom';

import Header from './common/Header';
import Products from './products';
import EditProduct from './products/EditProduct';
import Categories from './categories';
import EditCategory from './categories/EditCategory';
import Share from './share';
import Settings from './settings';
import SetLanguage from './settings/SetLanguage';

import '../styles/style.css';

const App = () => (
  <div>
    <Route path="/" component={Header} />
    <Route exact path="/" component={Products} />
    <Route path="/products/:id" component={EditProduct} />
    <Route exact path="/categories" component={Categories} />
    <Route path="/categories/:id" component={EditCategory} />
    <Route exact path="/share" component={Share} />
    <Route path="/settings" component={Settings} />
    <SetLanguage />
  </div>
);

export default App;
