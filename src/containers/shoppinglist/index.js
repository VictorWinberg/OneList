import React from 'react';

import ShoppingList from './ShoppingList';
import New from '../common/New';
import { addProduct, removeProduct } from '../../actions/products';

const Products = () => (
  <div>
    <New
      view="products"
      autosuggest
      onAdd={addProduct}
      onRemove={removeProduct}
    />
    <ShoppingList view="products" />
  </div>
);

export default Products;
