import { connect } from 'react-redux';

import Reorder from '../../components/Reorder';
import { reorderCategory } from '../../actions/categories';

const mapStateToProps = state => ({
  items: state.categories.map(category => ({
    ...category,
    value: category.name,
  })),
});

const mapDispatchToProps = {
  onItemReorder: reorderCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Reorder);
