import React from 'react';

import ProductList from './ProductList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import { addProduct, removeProduct } from '../../actions/products';

const Products = () => (
  <div>
    <New
      view="products"
      autosuggest
      onAdd={addProduct}
      onRemove={removeProduct}
    />
    <Snackbar />
    <ProductList view="products" />
  </div>
);

export default Products;
