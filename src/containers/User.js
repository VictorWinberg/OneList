import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { fetchUser } from '../actions/user';

class User extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUser());
  }

  render() {
    const { user, translate } = this.props;
    if (user.email) {
      return (
        <div>
          {translate('user.welcome', user)}
          <br />
          <a href="/__/logout">{translate('user.logout')}</a>
        </div>
      );
    }
    return <a href="/__/auth/google">{translate('user.login')}</a>;
  }
}

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  translate: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(User);
