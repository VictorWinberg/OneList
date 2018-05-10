import { connect } from 'react-redux';

import CategoryList from '../../components/CategoryList';
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
