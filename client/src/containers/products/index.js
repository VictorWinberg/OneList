import React from 'react';

import ProductList from './ProductList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import Filter from '../common/Filter';
import { addProduct, removeProduct } from '../../actions/products';
import { useProductListFilters } from '../../hooks/useProductListFilters';

const Products = () => {
  const {
    ageFilter,
    setAgeFilter,
    sortOrder,
    setSortOrder,
    restockFilter,
    onRestockFilterToggle,
    restockFilterDisabled,
  } = useProductListFilters();

  return (
    <div>
      <New
        view="products"
        autosuggest
        onAdd={addProduct}
        onRemove={removeProduct}
      />
      <Filter
        ageFilter={ageFilter}
        sortOrder={sortOrder}
        onAgeChange={setAgeFilter}
        onSortChange={setSortOrder}
        restockFilter={restockFilter}
        onRestockFilterToggle={onRestockFilterToggle}
        restockFilterDisabled={restockFilterDisabled}
      />
      <Snackbar />
      <ProductList
        view="products"
        ageFilter={ageFilter}
        sortOrder={sortOrder}
        restockFilter={restockFilter}
      />
    </div>
  );
};

export default Products;
