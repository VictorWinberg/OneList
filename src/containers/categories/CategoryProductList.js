import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { filter, flow, forEach, map, sortBy } from 'lodash/fp';

import { toggleProductInactive } from '../../actions/products';
import ProductList from '../../components/ProductList';

const active = (state, categoryId) => {
  const userId = state.user.isCollaboration ? 0 : state.user.id || 0;
  const [category] = state.categories.filter((category) => category.id === categoryId);
  const items = [];

  if (!category) {
    return [{ value: getTranslate(state.locale)('categories.nonexistent'), items }];
  }

  items = flow(
    map((product) => ({
      ...product,
      key: `${product.id}-${product.uid}`,
      value: product.name,
      checked: product.uid !== null && product.uid === userId,
    })),
    sortBy(({ name }) => [name.toLowerCase()]),
    filter(({ category }) => category === categoryId)
  )(state.products);

  return [{ ...category, value: category.name, items }];
};

const mapStateToProps = (state, { match, ...ownProps }) => ({
  active: active(state, Number(match.params.id)),
  checked: [],
  translate: getTranslate(state.locale),
  linkTo: (id) => `/products/${id}`,
  backUrl: `/categories/${match.params.id}`,
  getData: (item) => ({ ...item, userId: state.user.isCollaboration ? 0 : state.user.id || 0 }),
  ageFilter: ownProps.ageFilter,
  sortOrder: ownProps.sortOrder || 'nameAsc',
});

const mapDispatchToProps = {
  onItemClick: toggleProductInactive,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
