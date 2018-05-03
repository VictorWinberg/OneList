import React from 'react';

import ProductList from './ProductList';
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
    <ProductList view="products" />
  </div>
);

export default Products;
