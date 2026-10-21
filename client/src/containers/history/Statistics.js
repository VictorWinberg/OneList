import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

import { RESTOCK_FILTER_TOP_N } from '../../constants/products';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const isoDate = String(dateStr).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return isoDate;
  }
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format month using translations
const formatMonthWithTranslation = (monthStr, t) => {
  const [year, month] = monthStr.split('-');
  const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];
  const monthName = t(`date.monthsShort.${monthKeys[parseInt(month, 10) - 1]}`);
  return `${monthName} '${year.slice(2)}`;
};

const StatCard = ({ value, label, icon, color }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-content">
      <span className="stat-card-value" style={{ color }}>
        {value}
      </span>
      <span className="stat-card-label">{label}</span>
    </div>
  </div>
);

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const OverviewCards = ({
  totalPurchases,
  totalTrips = 0,
  mostActiveDay = null,
  purchaseFrequency,
}) => {
  const { t } = useTranslation();

  // Convert day number (0=Sunday, 1=Monday, ..., 6=Saturday) to translated day name
  const getDayName = (dayNum) => {
    if (dayNum === null || dayNum === undefined) return '-';
    const dayKeys = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return t(`date.daysOfWeek.${dayKeys[dayNum]}`);
  };

  return (
    <div className="overview-cards">
      <StatCard
        value={totalPurchases}
        label={t('history.totalPurchases')}
        icon="🛒"
        color="#458fde"
      />
      <StatCard
        value={totalTrips}
        label={t('history.totalTrips')}
        icon="🛍️"
        color="#8884d8"
      />
      <StatCard
        value={purchaseFrequency.itemsPerWeek}
        label={t('history.itemsPerWeek')}
        icon="📊"
        color="#ffc658"
      />
      <StatCard
        value={purchaseFrequency.tripsPerWeek || 0}
        label={t('history.tripsPerWeek')}
        icon="🗓️"
        color="#00C49F"
      />
      <StatCard
        value={getDayName(mostActiveDay)}
        label={t('history.mostActiveDay')}
        icon="📅"
        color="#ff7c7c"
      />
    </div>
  );
};

OverviewCards.propTypes = {
  totalPurchases: PropTypes.number.isRequired,
  totalTrips: PropTypes.number,
  mostActiveDay: PropTypes.number,
  purchaseFrequency: PropTypes.shape({
    itemsPerWeek: PropTypes.number.isRequired,
    itemsPerMonth: PropTypes.number.isRequired,
    tripsPerWeek: PropTypes.number,
    tripsPerMonth: PropTypes.number,
  }).isRequired,
};

const MonthlyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    ...item,
    name: formatMonthWithTranslation(item.month, t),
    purchases: item.count,
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.monthlyChart')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value) => [value, t('history.purchases')]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Line
              type="monotone"
              dataKey="purchases"
              stroke="#458fde"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
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

const DayOfWeekChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const dayOrder = [
    t('date.daysOfWeek.monday'),
    t('date.daysOfWeek.tuesday'),
    t('date.daysOfWeek.wednesday'),
    t('date.daysOfWeek.thursday'),
    t('date.daysOfWeek.friday'),
    t('date.daysOfWeek.saturday'),
    t('date.daysOfWeek.sunday'),
  ];
  const shortDays = [
    t('date.daysOfWeekShort.monday'),
    t('date.daysOfWeekShort.tuesday'),
    t('date.daysOfWeekShort.wednesday'),
    t('date.daysOfWeekShort.thursday'),
    t('date.daysOfWeekShort.friday'),
    t('date.daysOfWeekShort.saturday'),
    t('date.daysOfWeekShort.sunday'),
  ];

  const chartData = dayOrder.map((day, index) => {
    const found = data.find((d) => d.name === day);
    return {
      name: shortDays[index],
      fullName: day,
      count: found ? found.count : 0,
    };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.dayOfWeekChart')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value, _name, { payload }) => [
                value,
                payload.fullName,
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={
                    entry.count === maxCount && maxCount > 0
                      ? '#82ca9d'
                      : '#458fde'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

DayOfWeekChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const MostBoughtList = ({ data, dateRange }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="stats-section">
      <h3>{t('history.mostBoughtItems')}</h3>
      <p className="date-range">
        {formatDate(dateRange.first)} - {formatDate(dateRange.last)}
      </p>
      <ul className="most-bought-list">
        {data.slice(0, 10).map((item, index) => (
          <li key={item.name} className="most-bought-item">
            <span className="item-rank">{index + 1}.</span>
            <span className="item-name">{item.name}</span>
            <span className="item-count">{item.count}x</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

MostBoughtList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  dateRange: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
  }).isRequired,
};

const ProductRestockPredictions = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return '#ff7c7c';
      case 'soon':
        return '#ffc658';
      default:
        return '#82ca9d';
    }
  };

  const getDaysUntilRestock = (predictedRestockDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const predicted = new Date(predictedRestockDate);
    predicted.setHours(0, 0, 0, 0);
    return Math.round((predicted - today) / (1000 * 60 * 60 * 24));
  };

  const getStatusLabel = (status, daysUntil) => {
    if (daysUntil === 0) {
      switch (status) {
        case 'overdue':
          return t('history.statusOverdueToday');
        case 'soon':
          return t('history.statusSoonToday');
        default:
          return t('history.statusUpcomingToday');
      }
    }

    switch (status) {
      case 'overdue':
        return t('history.statusOverdueDays', { days: daysUntil });
      case 'soon':
        return t('history.statusSoonDays', { days: daysUntil });
      default:
        return t('history.statusUpcomingDays', { days: daysUntil });
    }
  };

  return (
    <div className="stats-section stats-section--full-width restock-predictions-section">
      <h3>{t('history.productRestockPredictions')}</h3>
      <p className="chart-description">
        {t('history.productRestockPredictionsDesc')}
      </p>
      <div className="restock-table-wrapper">
        <table className="restock-predictions-table">
          <thead>
            <tr>
              <th>{t('history.restockColumnProduct')}</th>
              <th>{t('history.status')}</th>
              <th>{t('history.restockColumnTimesBought')}</th>
              <th>{t('history.restockColumnAvgInterval')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.name}
                className={
                  index < RESTOCK_FILTER_TOP_N
                    ? 'restock-row--filter-top'
                    : 'restock-row--filter-cut'
                }
              >
                <td className="restock-cell-product">
                  <span className="restock-product-name">{item.name}</span>
                  {item.highlighted && (
                    <span
                      className="restock-frequent-badge"
                      aria-label={t('history.restockFrequentBuy')}
                      title={t('history.restockFrequentBuy')}
                    >
                      ★
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className="restock-status-pill"
                    style={{ color: getStatusColor(item.status) }}
                  >
                    {getStatusLabel(
                      item.status,
                      getDaysUntilRestock(item.predictedRestockDate)
                    )}
                  </span>
                </td>
                <td className="restock-cell-number">{item.purchaseCount}</td>
                <td className="restock-cell-number">
                  {t('history.restockEveryDays', { days: item.avgDays })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ProductRestockPredictions.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avgDays: PropTypes.number.isRequired,
      predictedRestockDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      purchaseCount: PropTypes.number.isRequired,
      highlighted: PropTypes.bool,
    })
  ).isRequired,
};

const StatsSectionTitle = ({ children }) => (
  <h2 className="stats-group-title">{children}</h2>
);

StatsSectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

const ShoppingHeatmap = ({ data }) => {
  const { t } = useTranslation();
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!data || data.length === 0) {
    return null;
  }

  const dayKeys = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  const pgDowToIndex = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const grid = dayKeys.map(() => hours.map(() => 0));
  let maxCount = 0;

  data.forEach(({ day, hour, count }) => {
    const row = pgDowToIndex[day];
    if (row !== undefined && hour >= 0 && hour < 24) {
      grid[row][hour] = count;
      maxCount = Math.max(maxCount, count);
    }
  });

  const getHeatColor = (count) => {
    if (count === 0 || maxCount === 0) return '#f0f4f8';
    const intensity = count / maxCount;
    const r = Math.round(69 + (130 - 69) * (1 - intensity));
    const g = Math.round(143 + (200 - 143) * (1 - intensity));
    const b = Math.round(222 + (255 - 222) * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getTooltipText = (dayKey, hour, count) => {
    const day = t(`date.daysOfWeek.${dayKey}`);
    if (count === 0) {
      return t('history.heatmapTooltipEmpty', { day, hour });
    }
    return t('history.heatmapTooltipTrips', { day, hour, count });
  };

  const handleCellEnter = (dayKey, hour, count, event) => {
    const cell = event.currentTarget;
    const wrapper = cell.closest('.shopping-heatmap-wrapper');
    if (!wrapper) return;

    const cellRect = cell.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const showBelow = cellRect.top - wrapperRect.top < 36;

    setHoveredCell({
      dayKey,
      hour,
      count,
      left: cellRect.left - wrapperRect.left + cellRect.width / 2,
      top: showBelow
        ? cellRect.bottom - wrapperRect.top + 8
        : cellRect.top - wrapperRect.top,
      showBelow,
    });
  };

  return (
    <div className="stats-section chart-section stats-section--full-width">
      <h3>{t('history.shoppingHeatmap')}</h3>
      <p className="chart-description">{t('history.shoppingHeatmapDesc')}</p>
      <div className="shopping-heatmap-wrapper">
        <div className="shopping-heatmap">
          <div className="heatmap-corner" />
          {hours.map((hour) => (
            <div key={`h-${hour}`} className="heatmap-hour-label">
              {hour % 4 === 0 ? `${hour}:00` : ''}
            </div>
          ))}
          {dayKeys.map((dayKey, rowIndex) => (
            <React.Fragment key={dayKey}>
              <div className="heatmap-day-label">
                {t(`date.daysOfWeekShort.${dayKey}`)}
              </div>
              {hours.map((hour) => {
                const count = grid[rowIndex][hour];
                const isHovered =
                  hoveredCell?.dayKey === dayKey && hoveredCell?.hour === hour;
                return (
                  <div
                    key={`${dayKey}-${hour}`}
                    className={`heatmap-cell${isHovered ? ' heatmap-cell--hovered' : ''}`}
                    style={{ backgroundColor: getHeatColor(count) }}
                    onMouseEnter={(event) =>
                      handleCellEnter(dayKey, hour, count, event)
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    aria-label={getTooltipText(dayKey, hour, count)}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {hoveredCell && (
          <div
            className={`heatmap-tooltip${
              hoveredCell.showBelow ? ' heatmap-tooltip--below' : ''
            }`}
            style={{
              left: hoveredCell.left,
              top: hoveredCell.top,
            }}
          >
            {getTooltipText(
              hoveredCell.dayKey,
              hoveredCell.hour,
              hoveredCell.count
            )}
          </div>
        )}
      </div>
      <div className="heatmap-legend">
        <span>{t('history.heatmapLess')}</span>
        <div className="heatmap-legend-gradient" />
        <span>{t('history.heatmapMore')}</span>
      </div>
    </div>
  );
};

ShoppingHeatmap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      hour: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const AbandonedProductsList = ({ data, totalCount, onDeleteProduct }) => {
  const { t } = useTranslation();
  const [deletingIds, setDeletingIds] = useState(() => new Set());

  if (!data || data.length === 0) {
    return null;
  }

  const handleDelete = async (id) => {
    if (!onDeleteProduct || deletingIds.has(id)) {
      return;
    }
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await onDeleteProduct(id);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="stats-section stats-section--full-width">
      <h3>{t('history.abandonedProducts')}</h3>
      <p className="chart-description">
        {t('history.abandonedProductsDesc')}
        {totalCount > data.length
          ? ` ${t('history.abandonedProductsShowingTop', {
              shown: data.length,
              total: totalCount,
            })}`
          : ` ${t('history.abandonedProductsTotal', { count: totalCount })}`}
      </p>
      <div className="restock-table-wrapper">
        <table className="restock-predictions-table abandoned-products-table">
          <thead>
            <tr>
              <th>{t('history.restockColumnProduct')}</th>
              <th>{t('history.addedToCatalog')}</th>
              <th>{t('history.lastPurchase')}</th>
              {onDeleteProduct ? (
                <th className="abandoned-products-actions-header">
                  {t('edit.delete')}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id ?? item.name}>
                <td className="restock-cell-product">{item.name}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  {item.lastPurchase
                    ? formatDate(item.lastPurchase)
                    : t('history.neverPurchased')}
                </td>
                {onDeleteProduct ? (
                  <td className="abandoned-products-actions-cell">
                    {item.id != null ? (
                      <button
                        type="button"
                        className="abandoned-products-delete-btn"
                        disabled={deletingIds.has(item.id)}
                        onClick={() => handleDelete(item.id)}
                      >
                        {t('edit.delete')}
                      </button>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

AbandonedProductsList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string,
      lastPurchase: PropTypes.string,
    })
  ).isRequired,
  totalCount: PropTypes.number.isRequired,
  onDeleteProduct: PropTypes.func,
};

const Statistics = ({ history, onDeleteAbandonedProduct }) => {
  const { t } = useTranslation();

  if (history.loading) {
    return (
      <div className="statistics-display">
        <p>{t('history.loading')}</p>
      </div>
    );
  }

  return (
    <div className="statistics-display">
      <OverviewCards
        totalPurchases={history.totalPurchases}
        totalTrips={history.totalTrips}
        mostActiveDay={history.mostActiveDay}
        purchaseFrequency={history.purchaseFrequency}
      />

      <StatsSectionTitle>
        {t('history.sectionPurchasingTrends')}
      </StatsSectionTitle>
      <ProductRestockPredictions
        data={history.productRestockPredictions || []}
      />

      <div className="charts-grid">
        <DayOfWeekChart data={history.dayOfWeekStats} />
      </div>
      <ShoppingHeatmap data={history.shoppingHeatmap || []} />

      <div className="charts-grid">
        <MostBoughtList
          data={history.mostBoughtItems}
          dateRange={history.dateRange}
        />
      </div>

      <AbandonedProductsList
        data={history.abandonedProducts || []}
        totalCount={history.abandonedProductsCount || 0}
        onDeleteProduct={onDeleteAbandonedProduct}
      />
    </div>
  );
};

Statistics.propTypes = {
  history: PropTypes.object.isRequired,
  onDeleteAbandonedProduct: PropTypes.func,
};

export default Statistics;
