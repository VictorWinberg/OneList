import React from 'react';
// import PropTypes from 'prop-types';

import ProductList from './ProductList';
import New from '../common/New';
import { addProduct } from '../../actions/products';

const Products = () => (
  <div>
    <New view="products" autosuggest onAdd={addProduct} />
    <ProductList />
  </div>
);

export default Products;
