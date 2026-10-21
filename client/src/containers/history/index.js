import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Statistics from './Statistics';
import Snackbar from '../common/Snackbar';
import { fetchStatistics } from '../../actions/history';
import { removeProduct } from '../../actions/products';

const History = ({
  isLoggedIn,
  history,
  loadStatistics,
  deleteAbandonedProduct,
}) => {
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
        <Statistics
          history={history}
          onDeleteAbandonedProduct={deleteAbandonedProduct}
        />
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
  deleteAbandonedProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.user.email,
  history: state.history,
});

const mapDispatchToProps = {
  loadStatistics: fetchStatistics,
  deleteAbandonedProduct: (id) => async (dispatch) => {
    await dispatch(removeProduct(id));
    return dispatch(fetchStatistics());
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
