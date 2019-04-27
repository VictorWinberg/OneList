import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLanguages,
  getTranslate,
  setActiveLanguage,
  getActiveLanguage,
} from 'react-localize-redux';
import { updateUser } from '../../actions/user';

const LanguageSelector = ({ myLanguage, translate, languages, update }) => (
  <div>
    <label htmlFor="land">
      <span>{translate('settings.language')}</span>
      <input name="lang" type="hidden" />
    </label>
    <select id="language" defaultValue={myLanguage.code} onChange={update}>
      {languages.map(language => (
        <option key={language.code}>{language.code}</option>
      ))}
    </select>
  </div>
);

LanguageSelector.defaultProps = {
  myLanguage: { code: 'en' },
};

LanguageSelector.propTypes = {
  myLanguage: PropTypes.shape({
    code: PropTypes.string.isRequired,
  }),
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  translate: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myLanguage: getActiveLanguage(state.locale),
  languages: getLanguages(state.locale),
  translate: getTranslate(state.locale),
  user: state.user,
});

const mapDispatchToProps = {
  setLanguage: setActiveLanguage,
  update: updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector);
