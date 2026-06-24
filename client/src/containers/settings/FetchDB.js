import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts } from '../../actions/products';
import { fetchCategories } from '../../actions/categories';
import { fetchStores } from '../../actions/stores';

class FetchDB extends Component {
  constructor() {
    super();
    this.interval = null;
    this.update = () => {};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, updateProducts, updateCategories, updateStores } = nextProps;
    const { username } = user;
    const { user: prevUser } = this.props;
    this.update = () => {
      updateStores();
      updateProducts();
      updateCategories();
    };

    const intervalUpdate = () => {
      clearInterval(this.interval);
      this.interval = setInterval(this.update, 5000);
    };

    if (username !== prevUser.username) {
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
  updateStores: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  updateProducts: fetchProducts,
  updateCategories: fetchCategories,
  updateStores: fetchStores,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchDB);
