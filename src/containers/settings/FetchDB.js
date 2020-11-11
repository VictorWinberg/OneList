import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts } from '../../actions/products';
import { fetchCategories } from '../../actions/categories';

class FetchDB extends Component {
  constructor() {
    super();
    this.interval = null;
    this.update = () => {};
  }

  componentWillReceiveProps({ user, updateProducts, updateCategories }) {
    const { username } = user;
    this.update = () => {
      updateProducts();
      updateCategories();
    };

    const intervalUpdate = () => {
      clearInterval(this.interval);
      this.interval = setInterval(this.update, 5000);
    };

    if (username !== this.props.user.username) {
      this.update();
      intervalUpdate();
      window.onclick = intervalUpdate;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FetchDB);
