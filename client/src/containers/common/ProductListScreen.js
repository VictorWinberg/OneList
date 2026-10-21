import React from 'react';
import PropTypes from 'prop-types';

import New from './New';
import Snackbar from './Snackbar';
import Filter from './Filter';
import { addProduct, removeProduct } from '../../actions/products';
import { useProductListFilters } from '../../hooks/useProductListFilters';

const ProductListScreen = ({ List, listProps }) => {
  const { filterProps, listFilterProps } = useProductListFilters();

  return (
    <div>
      <New
        view="products"
        autosuggest
        onAdd={addProduct}
        onRemove={removeProduct}
      />
      <Filter {...filterProps} />
      <Snackbar />
      <List view="products" {...listFilterProps} {...listProps} />
    </div>
  );
};

ProductListScreen.propTypes = {
  List: PropTypes.elementType.isRequired,
  listProps: PropTypes.object,
};

ProductListScreen.defaultProps = {
  listProps: {},
};

export default ProductListScreen;
