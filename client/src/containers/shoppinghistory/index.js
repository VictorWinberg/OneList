import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import StatisticsDisplay from './StatisticsDisplay';
import Snackbar from '../common/Snackbar';
import { fetchStatistics } from '../../actions/shoppingHistory';

const ShoppingHistory = ({
  isLoggedIn,
  loading,
  totalPurchases,
  purchaseFrequency,
  mostBoughtItems,
  monthlyPurchases,
  dateRange,
  loadStatistics,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      loadStatistics();
    }
  }, [isLoggedIn, loadStatistics]);

  return (
    <div className="shopping-history">
      <Snackbar />
      <h2>{t('shoppingHistory.title')}</h2>
      {isLoggedIn ? (
        <StatisticsDisplay
          loading={loading}
          totalPurchases={totalPurchases}
          purchaseFrequency={purchaseFrequency}
          mostBoughtItems={mostBoughtItems}
          monthlyPurchases={monthlyPurchases}
          dateRange={dateRange}
        />
      ) : (
        <p>{t('settings.unauthenticated')}</p>
      )}
    </div>
  );
};

ShoppingHistory.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  totalPurchases: PropTypes.number.isRequired,
  purchaseFrequency: PropTypes.shape({
    itemsPerWeek: PropTypes.number.isRequired,
    itemsPerMonth: PropTypes.number.isRequired,
  }).isRequired,
  mostBoughtItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  monthlyPurchases: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  dateRange: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
  }).isRequired,
  loadStatistics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.user.email,
  loading: state.shoppingHistory.loading,
  totalPurchases: state.shoppingHistory.totalPurchases,
  purchaseFrequency: state.shoppingHistory.purchaseFrequency,
  mostBoughtItems: state.shoppingHistory.mostBoughtItems,
  monthlyPurchases: state.shoppingHistory.monthlyPurchases,
  dateRange: state.shoppingHistory.dateRange,
});

const mapDispatchToProps = {
  loadStatistics: fetchStatistics,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoppingHistory);

