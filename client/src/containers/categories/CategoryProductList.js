import { connect } from 'react-redux';
import { filter, flow, map, sortBy } from 'lodash/fp';
import i18n from '../../i18n';

import { toggleProductInactive } from '../../actions/products';
import ProductList from '../../components/ProductList';

const active = (state, categoryId) => {
  const userId = state.user.isCollaboration ? 0 : state.user.id || 0;
  const [category] = state.categories.filter((cat) => cat.id === categoryId);

  if (!category) {
    return [{ value: i18n.t('categories.nonexistent'), items: [] }];
  }

  const items = flow(
    map((product) => ({
      ...product,
      key: `${product.id}-${product.uid}`,
      value: product.name,
      checked: product.uid !== null && product.uid === userId,
    })),
    sortBy(({ name }) => [name.toLowerCase()]),
    filter(({ category: productCategory }) => productCategory === categoryId)
  )(state.products);

  return [{ ...category, value: category.name, items }];
};

const mapStateToProps = (state, { match, ...ownProps }) => ({
  active: active(state, Number(match.params.id)),
  checked: [],
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
