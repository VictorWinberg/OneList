import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { toggleProduct, removeProducts } from '../../actions/products';
import List from '../../components/List';

const filtered = (products, isChecked) =>
  products
    .filter(({ active, checked }) => active && checked === isChecked)
    .map(product => ({
      ...product,
      value: product.name,
    }));

const mapStateToProps = state => ({
  items: filtered(state.products, false),
  checked: filtered(state.products, true),
  translate: getTranslate(state.locale),
  linkTo: id => `/products/${id}`,
});

const mapDispatchToProps = {
  onItemClick: toggleProduct,
  onRemoveItems: removeProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
