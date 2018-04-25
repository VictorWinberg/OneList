import React from 'react';
// import PropTypes from 'prop-types';

import ProductList from './ProductList';
import New from '../common/New';
import { addProduct } from '../../actions/products';
import { removeProduct } from '../../actions/db';

const Products = () => (
  <div>
    <New
      view="products"
      autosuggest
      onAdd={addProduct}
      onRemove={removeProduct}
    />
    <ProductList />
  </div>
);

export default Products;
