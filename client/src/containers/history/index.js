import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import StatisticsDisplay from './History';
import Snackbar from '../common/Snackbar';
import { fetchStatistics } from '../../actions/history';

const History = ({
  isLoggedIn,
  loading,
  totalPurchases,
  purchaseFrequency,
  mostBoughtItems,
  monthlyPurchases,
  categoryDistribution,
  dayOfWeekStats,
  productTrends,
  monthComparison,
  mostActiveDay = null,
  dailyPurchases,
  frequencyDistribution,
  productFrequency,
  intervalTrend,
  hourOfDay,
  weeklyComparison,
  seasonalTrends,
  categoryFrequency,
  productLifecycle,
  purchaseVelocity,
  intervalsSummary,
  loadStatistics,
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
        <StatisticsDisplay
          loading={loading}
          totalPurchases={totalPurchases}
          purchaseFrequency={purchaseFrequency}
          mostBoughtItems={mostBoughtItems}
          monthlyPurchases={monthlyPurchases}
          categoryDistribution={categoryDistribution}
          dayOfWeekStats={dayOfWeekStats}
          productTrends={productTrends}
          monthComparison={monthComparison}
          mostActiveDay={mostActiveDay}
          dailyPurchases={dailyPurchases}
          frequencyDistribution={frequencyDistribution}
          productFrequency={productFrequency}
          intervalTrend={intervalTrend}
          hourOfDay={hourOfDay}
          weeklyComparison={weeklyComparison}
          seasonalTrends={seasonalTrends}
          categoryFrequency={categoryFrequency}
          productLifecycle={productLifecycle}
          purchaseVelocity={purchaseVelocity}
          intervalsSummary={intervalsSummary}
        />
      ) : (
        <p>{t('settings.unauthenticated')}</p>
      )}
    </div>
  );
};

History.propTypes = {
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
  categoryDistribution: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  dayOfWeekStats: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  productTrends: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  monthComparison: PropTypes.shape({
    thisMonth: PropTypes.number.isRequired,
    lastMonth: PropTypes.number.isRequired,
    twoMonthsAgo: PropTypes.number.isRequired,
    thisMonthName: PropTypes.string,
    lastMonthName: PropTypes.string,
    twoMonthsAgoName: PropTypes.string,
    change: PropTypes.number.isRequired,
  }).isRequired,
  mostActiveDay: PropTypes.string,
  dailyPurchases: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  frequencyDistribution: PropTypes.array,
  productFrequency: PropTypes.array,
  intervalTrend: PropTypes.array,
  hourOfDay: PropTypes.array,
  weeklyComparison: PropTypes.array,
  seasonalTrends: PropTypes.array,
  categoryFrequency: PropTypes.array,
  productLifecycle: PropTypes.array,
  purchaseVelocity: PropTypes.array,
  intervalsSummary: PropTypes.object,
  loadStatistics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.user.email,
  loading: state.history.loading,
  totalPurchases: state.history.totalPurchases,
  uniqueProducts: state.history.uniqueProducts,
  purchaseFrequency: state.history.purchaseFrequency,
  mostBoughtItems: state.history.mostBoughtItems,
  monthlyPurchases: state.history.monthlyPurchases,
  categoryDistribution: state.history.categoryDistribution,
  dayOfWeekStats: state.history.dayOfWeekStats,
  dayOfMonthStats: state.history.dayOfMonthStats,
  productTrends: state.history.productTrends,
  monthComparison: state.history.monthComparison,
  mostActiveDay: state.history.mostActiveDay,
  dailyPurchases: state.history.dailyPurchases,
  dateRange: state.history.dateRange,
  frequencyDistribution: state.history.frequencyDistribution,
  productFrequency: state.history.productFrequency,
  intervalTrend: state.history.intervalTrend,
  hourOfDay: state.history.hourOfDay,
  weeklyComparison: state.history.weeklyComparison,
  seasonalTrends: state.history.seasonalTrends,
  categoryFrequency: state.history.categoryFrequency,
  productLifecycle: state.history.productLifecycle,
  purchaseVelocity: state.history.purchaseVelocity,
  intervalsSummary: state.history.intervalsSummary,
});

const mapDispatchToProps = {
  loadStatistics: fetchStatistics,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
