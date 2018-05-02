import { connect } from 'react-redux';

import DnDList from '../../components/DnDList';
import { reorderCategory } from '../../actions/categories';

const mapStateToProps = state => ({
  items: state.categories.map(category => ({
    ...category,
    value: category.name,
  })),
  linkTo: id => `/categories/${id}`,
});

const mapDispatchToProps = {
  onItemReorder: reorderCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(DnDList);
