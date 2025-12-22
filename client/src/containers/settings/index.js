import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import LanguageSelector from './LanguageSelector';
import User from './User';
import Snackbar from '../common/Snackbar';
import { logoutUser } from '../../actions/user';

const Settings = ({ isLoggedIn, logout, t, i18n }) => (
  <div className="settings">
    <Snackbar />
    <h2>{t('settings.title')}</h2>
    {!isLoggedIn && <LanguageSelector />}
    {isLoggedIn ? (
      <div>
        <p>{t('settings.authenticated')}</p>
        <User key={i18n.language} />
        <button type="button" className="logoutBtn" onClick={logout}>
          {t('user.logout')}
        </button>
      </div>
    ) : (
      <div>
        <p>{t('settings.unauthenticated')}</p>
        <a className="loginBtn" href="/__/auth/google">
          {t('user.login')}
        </a>
      </div>
    )}
  </div>
);

Settings.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.user.email,
});

const mapDispatchToProps = {
  logout: logoutUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Settings));
