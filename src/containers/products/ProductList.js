import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/filter';

import { toggleProduct, removeProducts } from '../../actions/products';
import List from '../../components/List';

const filterProducts = (products, filter) => {
  switch (filter) {
    case SHOW_ALL:
      return products;
    case SHOW_COMPLETED:
      return products.filter(item => item.completed);
    case SHOW_ACTIVE:
      return products.filter(item => !item.completed);
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

const mapStateToProps = state => ({
  items: filterProducts(state.products, SHOW_ACTIVE),
  checked: filterProducts(state.products, SHOW_COMPLETED),
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = {
  onItemClick: toggleProduct,
  onRemoveItems: removeProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
