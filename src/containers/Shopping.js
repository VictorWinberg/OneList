import React from 'react';
// import PropTypes from 'prop-types';

import ProductList from './ProductList';
import New from './New';
import { addProduct } from '../actions/products';

const Shopping = () => (
  <div>
    <New onAdd={addProduct} />
    <ProductList />
  </div>
);

export default Shopping;
