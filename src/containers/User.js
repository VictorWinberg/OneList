import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import LanguageSelector from './LanguageSelector';
import { updateUser, submitUser } from '../actions/user';

const User = ({ user, translate, update, submit }) => (
  <form className="userform" onSubmit={event => submit(event, user)}>
    <img src={user.photo} id="userphoto" alt="profile" />
    <br />
    <label htmlFor="username">
      {translate('user.name')}
      <input
        id="username"
        type="text"
        autoComplete="off"
        value={user.username}
        onChange={update}
      />
    </label>
    <label htmlFor="email">
      {translate('user.email')}
      <input
        id="email"
        type="text"
        autoComplete="off"
        value={user.email}
        onChange={update}
      />
    </label>
    <LanguageSelector />
    <button type="submit">{translate('user.submit')}</button>
  </form>
);

User.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
  translate: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  user: state.user,
});

const mapDispatchToProps = {
  update: updateUser,
  submit: submitUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
