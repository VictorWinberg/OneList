import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import LanguageSelector from './LanguageSelector';
import { updateUser, submitUser } from '../../actions/user';

const User = ({ user, update, submit }) => {
  const { t } = useTranslation();

  return (
    <form className="userform" onSubmit={event => submit(event, user)}>
      <div className="setting-wrapper">
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
      </div>
      <button className="saveBtn" type="submit">{t('user.submit')}</button>
    </form>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
  update: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {
  update: updateUser,
  submit: submitUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
