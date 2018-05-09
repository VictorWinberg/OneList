import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import LanguageSelector from './LanguageSelector';
import User from './User';
import { logoutUser } from '../../actions/user';

const Settings = ({ translate, user, logout }) => (
  <div className="settings">
    <h2>{translate('settings.title')}</h2>
    {user.email ? (
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
