import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLanguages,
  getTranslate,
  setActiveLanguage,
  getActiveLanguage,
} from 'react-localize-redux';

const LanguageSelector = ({
  translate,
  languages,
  currentLanguage,
  setLanguage,
}) => (
  <p>
    {translate('settings.language')}
    {languages
      .filter(language => language.code !== currentLanguage.code)
      .map(language => (
        <button key={language.code} onClick={() => setLanguage(language.code)}>
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
  setLanguage: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  languages: getLanguages(state.locale),
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale),
});

const mapDispatchToProps = {
  setLanguage: setActiveLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
