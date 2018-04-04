import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLanguages, setActiveLanguage } from 'react-localize-redux';

const LanguageSelector = ({ languages, setLanguage }) => (
  <div>
    {languages.map(language => (
      <button key={language.code} onClick={() => setLanguage(language.code)}>
        {language.code}
      </button>
    ))}
  </div>
);

LanguageSelector.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  setLanguage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ languages: getLanguages(state.locale) });
const mapDispatchToProps = { setLanguage: setActiveLanguage };

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
