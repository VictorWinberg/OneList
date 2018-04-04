import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchUser } from '../actions/user';

class User extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUser());
  }

  render() {
    const { user } = this.props;
    if (user.email) {
      return (
        <div>
          {`Welcome ${user.username}! Nice email: ${user.email} ;)`}
          <br />
          <a href="/__/logout">Logout</a>
        </div>
      );
    }
    return <a href="/__/auth/google">Log In</a>;
  }
}

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(User);
