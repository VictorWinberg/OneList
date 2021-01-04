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
  uniqBy,
  zipObject,
} from 'lodash/fp';

import { toggleProductInactive } from '../../actions/products';
import ProductList from '../../components/ProductList';

// TODO: Move some of this logic to a helpers function

const active = (state) => {
  const userId = state.user.isCollaboration ? 0 : state.user.id || 0;
  const uncategorized = getTranslate(state.locale)('categories.uncategorized');
  const getCategory = ({ category }) =>
    get('name', find({ id: toInteger(category) }, state.categories));

  return flow(
    map(product => ({
      ...product,
      key: `${product.id}-${product.uid}`,
      checked: product.uid !== null && product.uid === userId,
      categoryName: getCategory(product),
    })),
    sortBy(({ name, uid }) => [name.toLowerCase(), uid !== userId]),
    uniqBy('id'),
    groupBy('categoryName'),
    mergeWith((category, products) => ({
      ...category,
      value: getOr(uncategorized, 'name', category),
      orderidx: getOr(0, 'orderidx', category),
      items: map(product => ({ ...product, value: product.name }), products),
    }))(zipObject(map('name', state.categories), state.categories)),
    filter('items.length'),
    sortBy('orderidx')
  )(state.products);
};

const mapStateToProps = state => ({
  active: active(state),
  checked: [],
  translate: getTranslate(state.locale),
  linkTo: id => `/products/${id}`,
  backUrl: '/products',
  getData: (item) => ({ ...item, userId: state.user.isCollaboration ? 0 : state.user.id || 0 }),
});

const mapDispatchToProps = {
  onItemClick: toggleProductInactive,
  onDoneClick: () => null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
