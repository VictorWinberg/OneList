import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${monthNames[parseInt(month, 10) - 1]} '${year.slice(2)}`;
};

const MonthlyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="stats-section">
      <h3>{t('shoppingHistory.monthlyChart')}</h3>
      <div className="monthly-chart">
        {data.map((item) => (
          <div key={item.month} className="chart-bar-container">
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{ height: `${(item.count / maxCount) * 100}%` }}
              >
                <span className="chart-bar-value">{item.count}</span>
              </div>
            </div>
            <span className="chart-bar-label">{formatMonth(item.month)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

MonthlyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const StatisticsDisplay = ({
  loading,
  totalPurchases,
  purchaseFrequency,
  mostBoughtItems,
  monthlyPurchases,
  dateRange,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="statistics-display">
        <p>{t('shoppingHistory.loading')}</p>
      </div>
    );
  }

  if (totalPurchases === 0) {
    return (
      <div className="statistics-display">
        <p>{t('shoppingHistory.noData')}</p>
      </div>
    );
  }

  return (
    <div className="statistics-display">
      <MonthlyChart data={monthlyPurchases} />

      <div className="stats-section">
        <h3>{t('shoppingHistory.purchaseFrequency')}</h3>
        <ul className="stats-list">
          <li>
            <span className="stat-value">{purchaseFrequency.itemsPerWeek}</span>
            <span className="stat-label">
              {t('shoppingHistory.itemsPerWeek')}
            </span>
          </li>
          <li>
            <span className="stat-value">
              {purchaseFrequency.itemsPerMonth}
            </span>
            <span className="stat-label">
              {t('shoppingHistory.itemsPerMonth')}
            </span>
          </li>
        </ul>
      </div>

      <div className="stats-section">
        <h3>{t('shoppingHistory.totalPurchases')}</h3>
        <p className="total-count">{totalPurchases}</p>
        <p className="date-range">
          {formatDate(dateRange.first)} - {formatDate(dateRange.last)}
        </p>
      </div>

      <div className="stats-section">
        <h3>{t('shoppingHistory.mostBoughtItems')}</h3>
        <ul className="most-bought-list">
          {mostBoughtItems.map((item, index) => (
            <li key={item.name} className="most-bought-item">
              <span className="item-rank">{index + 1}.</span>
              <span className="item-name">{item.name}</span>
              <span className="item-count">{item.count}x</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

StatisticsDisplay.propTypes = {
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
};

export default StatisticsDisplay;
