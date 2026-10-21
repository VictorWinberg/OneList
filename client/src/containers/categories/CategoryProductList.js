import { connect } from 'react-redux';
import { filter, flow, map, sortBy } from 'lodash/fp';
import i18n from '../../i18n';

import { toggleProductInactive } from '../../actions/products';
import ProductList from '../../components/ProductList';
import { mapProductListCommonState } from '../common/productListConnect';

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
  ...mapProductListCommonState(state, ownProps),
  active: active(state, Number(match.params.id)),
  backUrl: `/categories/${match.params.id}`,
});

const mapDispatchToProps = {
  onItemClick: toggleProductInactive,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
