import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import LanguageSelector from './LanguageSelector';
import User from './User';
import Snackbar from '../common/Snackbar';
import { logoutUser } from '../../actions/user';

const Settings = ({ translate, isLoggedIn, logout }) => (
  <div className="settings">
    <Snackbar />
    <h2>{translate('settings.title')}</h2>
    {isLoggedIn ? (
      <div>
        <p>{translate('settings.authenticated')}</p>
        <User />
        <button className="logoutBtn" onClick={logout}>
          {translate('user.logout')}
        </button>
      </div>
    ) : (
      <div>
        <LanguageSelector />
        <p>{translate('settings.unauthenticated')}</p>
        <a className="loginBtn" href="/__/auth/google">
          {translate('user.login')}
        </a>
      </div>
    )}
  </div>
);

Settings.propTypes = {
  translate: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  isLoggedIn: !!state.user.email,
});

const mapDispatchToProps = {
  logout: logoutUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
