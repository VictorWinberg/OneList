import { connect } from 'react-redux';

import CategoryList from '../../components/CategoryList';
import { reorderCategory } from '../../actions/categories';

const mapStateToProps = state => ({
  items: state.categories.map(category => ({
    ...category,
    value: category.name,
  })),
  onClick: id => `/categories/${id}`,
  linkTo: id => `/categories/edit/${id}`,
});

const mapDispatchToProps = {
  onItemReorder: reorderCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
