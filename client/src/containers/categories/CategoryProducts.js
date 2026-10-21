import React from 'react';

import ProductListScreen from '../common/ProductListScreen';
import CategoryProductList from './CategoryProductList';

const CategoryProducts = (props) => (
  <ProductListScreen List={CategoryProductList} listProps={props} />
);

export default CategoryProducts;
