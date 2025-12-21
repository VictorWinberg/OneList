import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LanguageSelector from './LanguageSelector';
import { updateUser, submitUser } from '../../actions/user';

const User = ({ user, update, submit, t }) => (
  <form className="userform" onSubmit={(event) => submit(event, user)}>
    <img src={user.photo} id="userphoto" alt="profile" />
    <br />
    <label htmlFor="username">
      <span>{t('user.name')}</span>
      <input
        id="username"
        type="text"
        autoComplete="off"
        value={user.username}
        onChange={update}
      />
    </label>
    <label htmlFor="email">
      <span>{t('user.email')}</span>
      <input
        id="email"
        type="text"
        autoComplete="off"
        value={user.email}
        onChange={update}
      />
    </label>
    <LanguageSelector />
    <br />
    <Link to="/history" className="history-link">
      {t('user.showHistory')}
    </Link>
    <button className="saveBtn" type="submit">
      {t('user.submit')}
    </button>
  </form>
);

User.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
  update: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  update: updateUser,
  submit: submitUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(User));
