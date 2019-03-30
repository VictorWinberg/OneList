import React from 'react';
import { Route } from 'react-router-dom';

import Header from './common/Header';
import ShoppingList from './shoppinglist';
import EditProduct from './shoppinglist/EditProduct';
import Categories from './categories';
import EditCategory from './categories/EditCategory';
import Products from './products';
import Settings from './settings';
import SetLanguage from './settings/SetLanguage';
import FetchDB from './settings/FetchDB';

import '../styles/style.css';

const App = () => (
  <div>
    <Route path="/" component={Header} />
    <Route exact path="/" component={ShoppingList} />
    <Route path="/shoppinglist/:id" component={EditProduct} />
    <Route exact path="/categories" component={Categories} />
    <Route path="/categories/:id" component={EditCategory} />
    <Route exact path="/products" component={Products} />
    <Route path="/settings" component={Settings} />
    <SetLanguage />
    <FetchDB />
  </div>
);

export default App;
