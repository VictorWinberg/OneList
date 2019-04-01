import React from 'react';
import { Route } from 'react-router-dom';

import Header from './common/Header';
import ShoppingList from './shoppinglist';
import Categories from './categories';
import EditCategory from './categories/EditCategory';
import Products from './products';
import EditProduct from './products/EditProduct';
import Settings from './settings';
import SetLanguage from './settings/SetLanguage';
import FetchDB from './settings/FetchDB';

import '../styles/style.css';

const App = () => (
  <div>
    <Route path="/" component={Header} />
    <Route exact path="/" component={ShoppingList} />
    <Route exact path="/categories" component={Categories} />
    <Route path="/categories/:id" component={EditCategory} />
    <Route exact path="/products" component={Products} />
    <Route path="/products/:id" component={EditProduct} />
    <Route path="/settings" component={Settings} />
    <SetLanguage />
    <FetchDB />
  </div>
);

export default App;
