import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import LanguageSelector from './LanguageSelector';

const Settings = ({ translate, user }) => (
  <div>
    <h1>{translate('settings.title')}</h1>
    <LanguageSelector />
    {user.email ? (
      <div>
        <p>{translate('user.welcome', user)}</p>
        <p>{translate('settings.body')}</p>
        <a href="/__/logout">{translate('user.logout')}</a>
      </div>
    ) : (
      <div>
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
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  user: state.user,
});

export default connect(mapStateToProps)(Settings);
