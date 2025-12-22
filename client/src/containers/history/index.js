import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Statistics from './Statistics';
import Snackbar from '../common/Snackbar';
import { fetchStatistics } from '../../actions/history';

const History = ({ isLoggedIn, history, loadStatistics }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      loadStatistics();
    }
  }, [isLoggedIn, loadStatistics]);

  return (
    <div className="history">
      <Snackbar />
      <h2>{t('history.title')}</h2>
      {isLoggedIn ? (
        <Statistics history={history} />
      ) : (
        <p>{t('settings.unauthenticated')}</p>
      )}
    </div>
  );
};

History.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  loadStatistics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.user.email,
  history: state.history,
});

const mapDispatchToProps = {
  loadStatistics: fetchStatistics,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
