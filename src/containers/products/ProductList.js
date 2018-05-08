import { connect } from 'react-redux';
import {
  flow,
  mergeWith,
  groupBy,
  filter,
  map,
  zipObject,
  getOr,
} from 'lodash/fp';
import { getTranslate } from 'react-localize-redux';

import { toggleProduct, removeProducts } from '../../actions/products';
import SectionedList from '../../components/SectionedList';

const sectioned = state => {
  const uncategorized = getTranslate(state.locale)('categories.uncategorized');

  return flow(
    filter({ active: true, checked: false }),
    groupBy('category'),
    mergeWith((category, products) => ({
      value: getOr(uncategorized, 'name', category),
      items: map(product => ({ ...product, value: product.name }), products),
    }))(zipObject(map('id', state.categories), state.categories)),
    filter('items.length')
  )(state.products);
};

const checked = state =>
  flow(
    filter({ active: true, checked: true }),
    map(product => ({ ...product, value: product.name }))
  )(state.products);

const mapStateToProps = state => ({
  active: sectioned(state),
  checked: checked(state),
  translate: getTranslate(state.locale),
  linkTo: id => `/products/${id}`,
});

const mapDispatchToProps = {
  onItemClick: toggleProduct,
  onRemoveItems: removeProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionedList);
