import React from 'react';

import ShoppingList from './ShoppingList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import StorePicker from '../common/StorePicker';
import { addProduct, removeProduct } from '../../actions/products';

function Products() {
  return (
    <div>
      <StorePicker />
      <New
        view="products"
        autosuggest
        onAdd={addProduct}
        onRemove={removeProduct}
      />
      <Snackbar />
      <ShoppingList view="products" />
    </div>
  );
}

export default Products;
