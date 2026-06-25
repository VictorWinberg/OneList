import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts } from '../../actions/products';
import { fetchStores } from '../../actions/stores';

class FetchDB extends Component {
  constructor() {
    super();
    this.interval = null;
  }

  componentDidUpdate(prevProps) {
    const { user, updateProducts, updateStores } = this.props;
    const { username } = user;
    const { user: prevUser } = prevProps;

    if (username !== prevUser.username) {
      const update = () => {
        updateStores();
        updateProducts();
      };

      const intervalUpdate = () => {
        clearInterval(this.interval);
        this.interval = setInterval(update, 5000);
      };

      update();
      intervalUpdate();
      window.onclick = intervalUpdate;
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.onclick = null;
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
  updateStores: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  updateProducts: fetchProducts,
  updateStores: fetchStores,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchDB);
