import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateUser } from '../../actions/user';

const LanguageSelector = ({ update }) => {
  const { t, i18n } = useTranslation();
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sv', name: 'Svenska' },
    { code: 'es', name: 'Español' },
  ];

  const handleChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    update(e);
  };

  return (
    <div key={i18n.language}>
      <label htmlFor="land">
        <span>{t('settings.language')}</span>
        <input name="lang" type="hidden" />
      </label>
      <select id="language" value={i18n.language} onChange={handleChange}>
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.code}
          </option>
        ))}
      </select>
    </div>
  );
};

LanguageSelector.propTypes = {
  update: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  update: updateUser,
};

export default connect(null, mapDispatchToProps)(LanguageSelector);
