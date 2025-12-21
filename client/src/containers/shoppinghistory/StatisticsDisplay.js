import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  // Transform data for recharts: convert month format and add formatted name
  const chartData = data.map((item) => ({
    ...item,
    name: formatMonth(item.month),
    purchases: item.count,
  }));

  return (
    <div className="stats-section">
      <h3>{t('shoppingHistory.monthlyChart')}</h3>
      <div className="monthly-chart" style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [value, 'Purchases']}
              labelStyle={{ color: '#333' }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar
              dataKey="purchases"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top', fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
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
