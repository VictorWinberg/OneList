import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import LanguageSelector from './LanguageSelector';
import User from './User';
import { logoutUser } from '../actions/user';

const Settings = ({ translate, user, logout }) => (
  <div>
    <h1>{translate('settings.title')}</h1>
    {user.email ? (
      <div>
        <p>{translate('settings.body')}</p>
        <User />
        <button onClick={logout}>{translate('user.logout')}</button>
      </div>
    ) : (
      <div>
        <LanguageSelector />
        <p>{translate('user.unauthenticated')}</p>
        <a href="/__/auth/google">{translate('user.login')}</a>
      </div>
    )}
  </div>
);

Settings.propTypes = {
  translate: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  user: state.user,
});

const mapDispatchToProps = {
  logout: logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
