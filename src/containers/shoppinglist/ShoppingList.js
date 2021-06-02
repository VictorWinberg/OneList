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

import {
  toggleProductChecked,
  inactivateProducts,
} from '../../actions/products';
import ProductList from '../../components/ProductList';

// TODO: Move some of this logic to a helpers function

const active = ({ user, ...state }) => {
  const uncategorized = getTranslate(state.locale)('categories.uncategorized');
  const getCategory = ({ category }) =>
    get('name', find({ id: toInteger(category) }, state.categories));

  return flow(
    filter(['checked', false]),
    filter((item) => item.uid === 0 || item.uid === user.id),
    map((item) => ({
      ...item,
      italic: (user.isCollaboration && item.uid === user.id) || (!user.isCollaboration && item.uid === 0)
    })),
    map(product => ({
      ...product,
      key: `${product.id}-${product.uid}`,
      categoryName: getCategory(product),
    })),
    sortBy(({ name, uid }) => [name.toLowerCase(), uid]),
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

const checked = ({ user, ...state }) =>
  flow(
    filter(['checked', true]),
    filter((item) => item.uid === 0 || (!user.isCollaboration && item.uid === user.id)),
    map(product => ({
      ...product,
      key: `${product.id}-${product.uid}`,
      value: product.name,
    }))
  )(state.products);

const mapStateToProps = state => ({
  active: active(state),
  checked: checked(state),
  translate: getTranslate(state.locale),
  linkTo: id => `/products/${id}`,
  backUrl: '/',
  isLoggedIn: !!state.user.email,
  getData: (item) => ({ ...item, userId: state.user.isCollaboration ? 0 : state.user.id || 0 }),
});

const mapDispatchToProps = {
  onItemClick: toggleProductChecked,
  onDoneClick: inactivateProducts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
