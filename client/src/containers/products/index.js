import React, { useState } from 'react';

import ProductList from './ProductList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import Filter from '../common/Filter';
import { addProduct, removeProduct } from '../../actions/products';

const Products = () => {
  const [ageFilter, setAgeFilter] = useState('1y');
  const [sortOrder, setSortOrder] = useState('nameAsc');

  return (
    <div>
      <New view="products" autosuggest onAdd={addProduct} onRemove={removeProduct} />
      <Filter
        ageFilter={ageFilter}
        sortOrder={sortOrder}
        onAgeChange={setAgeFilter}
        onSortChange={setSortOrder}
      />
      <Snackbar />
      <ProductList view="products" ageFilter={ageFilter} sortOrder={sortOrder} />
    </div>
  );
};

export default Products;
