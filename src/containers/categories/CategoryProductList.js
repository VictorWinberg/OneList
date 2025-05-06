import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { flow, forEach, sortBy } from 'lodash/fp';

import { toggleProductInactive } from '../../actions/products';
import ProductList from '../../components/ProductList';

const active = (state, categoryId) => {
  const [category] = state.categories.filter(
    (category) => category.id === categoryId
  );
  const items = [];

  if (!category) {
    return [
      { value: getTranslate(state.locale)('categories.nonexistent'), items },
    ];
  }

  flow(
    sortBy(({ name }) => [name.toLowerCase()]),
    forEach((product) => {
      (product.categoryIds || []).forEach((_categoryId) => {
        if (_categoryId === categoryId) {
          items.push({
            ...product,
            key: `${product.id}-${product.uid}`,
            checked: product.active,
            value: product.name,
          });
        }
      });
    })
  )(state.products);

  return [{ ...category, value: category.name, items }];
};

const mapStateToProps = (state, { match }) => ({
  active: active(state, Number(match.params.id)),
  checked: [],
  translate: getTranslate(state.locale),
  linkTo: (id) => `/products/${id}`,
  backUrl: '/products',
});

const mapDispatchToProps = {
  onItemClick: toggleProductInactive,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
