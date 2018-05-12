import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts } from '../../actions/products';
import { fetchCategories } from '../../actions/categories';

class FetchDB extends Component {
  componentWillReceiveProps({ user, updateProducts, updateCategories }) {
    const { username } = user;
    if (username !== this.props.user.username) {
      updateProducts();
      updateCategories();
    }
  }

  render() {
    return null;
  }
}

FetchDB.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
  updateProducts: PropTypes.func.isRequired,
  updateCategories: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {
  updateProducts: fetchProducts,
  updateCategories: fetchCategories,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchDB);
