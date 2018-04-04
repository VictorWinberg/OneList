import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchUser } from '../actions/user';

class FetchUser extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUser());
  }

  render() {
    return null;
  }
}

FetchUser.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(FetchUser);
