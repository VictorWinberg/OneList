import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

const Settings = ({ translate }) => (
  <div>
    <h1>{translate('settings.title')}</h1>
    <p>{translate('settings.body')}</p>
  </div>
);

Settings.propTypes = {
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(Settings);
