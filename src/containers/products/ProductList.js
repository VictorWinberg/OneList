import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import {
  filter,
  find,
  flow,
  get,
  getOr,
  groupBy,
  map,
  mergeWith,
  sortBy,
  toInteger,
  zipObject,
} from 'lodash/fp';

import { toggleProduct, removeProducts } from '../../actions/products';
import ProductList from '../../components/ProductList';

// TODO: Move some of this logic to a helpers function

const sectioned = state => {
  const uncategorized = getTranslate(state.locale)('categories.uncategorized');
  const getCategory = ({ category }) =>
    get('name', find({ id: toInteger(category) }, state.categories));

  return flow(
    filter({ active: true, checked: false }),
    map(product => ({
      ...product,
      categoryName: getCategory(product),
    })),
    groupBy('categoryName'),
    mergeWith((category, products) => ({
      ...category,
      value: getOr(uncategorized, 'name', category),
      items: map(product => ({ ...product, value: product.name }), products),
    }))(zipObject(map('name', state.categories), state.categories)),
    filter('items.length'),
    sortBy(['at', 'id'])
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
