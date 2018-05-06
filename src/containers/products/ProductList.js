import { connect } from 'react-redux';
import {
  flow,
  mergeWith,
  groupBy,
  filter,
  reject,
  map,
  zipObject,
  getOr,
  values,
} from 'lodash/fp';
import { getTranslate } from 'react-localize-redux';

import { toggleProduct, removeProducts } from '../../actions/products';
import SectionedList from '../../components/SectionedList';

const filtered = (state, f) => {
  const uncategorized = getTranslate(state.locale)('categories.uncategorized');

  return flow(
    filter('active'),
    f('checked'),
    groupBy('category'),
    mergeWith((category, products) => ({
      value: getOr(uncategorized, 'name', category),
      items: map(product => ({ ...product, value: product.name }), products),
    }))(zipObject(map('id', state.categories), state.categories)),
    filter('items.length'),
    values
  )(state.products);
};

const mapStateToProps = state => ({
  active: filtered(state, reject),
  checked: filtered(state, filter),
  translate: getTranslate(state.locale),
  linkTo: id => `/products/${id}`,
});

const mapDispatchToProps = {
  onItemClick: toggleProduct,
  onRemoveItems: removeProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionedList);
