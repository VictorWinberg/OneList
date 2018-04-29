import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { toggleProduct, removeProducts } from '../../actions/products';
import List from '../../components/List';

const showChecked = (products, isChecked) =>
  products.filter(item => item.checked === isChecked).map(item => ({
    ...item,
    value: item.name,
  }));

const mapStateToProps = state => ({
  items: showChecked(state.products, false),
  checked: showChecked(state.products, true),
  translate: getTranslate(state.locale),
  linkTo: id => `/products/${id}`,
});

const mapDispatchToProps = {
  onItemClick: toggleProduct,
  onRemoveItems: removeProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
