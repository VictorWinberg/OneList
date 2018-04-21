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

const LanguageSelector = ({
  translate,
  languages,
  currentLanguage,
  setLanguage,
  update,
}) => (
  <p>
    {translate('settings.language')}
    {languages
      .filter(language => language.code !== currentLanguage.code)
      .map(language => (
        <button
          key={language.code}
          type="button"
          onClick={() =>
            setLanguage(language.code) &&
            update({ target: { id: 'language', value: language.code } })
          }
        >
          {language.code}
        </button>
      ))}
  </p>
);

LanguageSelector.propTypes = {
  currentLanguage: PropTypes.shape({
    code: PropTypes.string,
  }).isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  translate: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentLanguage: getActiveLanguage(state.locale),
  languages: getLanguages(state.locale),
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = {
  setLanguage: setActiveLanguage,
  update: updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
