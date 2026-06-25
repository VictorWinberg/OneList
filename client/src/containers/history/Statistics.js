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
  Legend,
} from 'recharts';

// Color palette for charts
const COLORS = [
  '#458fde',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8884d8',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#a4de6c',
  '#d0ed57',
];

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
  monthComparison,
}) => {
  const { t } = useTranslation();
  const changeIndicator =
    monthComparison.change >= 0
      ? `+${monthComparison.change}%`
      : `${monthComparison.change}%`;

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
      <StatCard
        value={changeIndicator}
        label={t('history.monthChange')}
        icon={monthComparison.change >= 0 ? '📈' : '📉'}
        color={monthComparison.change >= 0 ? '#82ca9d' : '#ff7c7c'}
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
  monthComparison: PropTypes.shape({
    thisMonth: PropTypes.number.isRequired,
    lastMonth: PropTypes.number.isRequired,
    twoMonthsAgo: PropTypes.number.isRequired,
    thisMonthName: PropTypes.string,
    lastMonthName: PropTypes.string,
    twoMonthsAgoName: PropTypes.string,
    change: PropTypes.number.isRequired,
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

const ProductPurchaseBarChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.slice(0, 10).map((item) => ({
    name: item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name,
    fullName: item.name,
    count: item.count,
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.productBarChart')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              width={75}
            />
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
            <Bar dataKey="count" fill="#458fde" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ProductPurchaseBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
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

const MonthComparisonChart = ({ data }) => {
  const { t } = useTranslation();

  const formatMonthName = (date) => {
    const monthNames = [
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
    return t(`date.months.${monthNames[date.getMonth()]}`);
  };

  const now = new Date();
  const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgoDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const chartData = [
    {
      name: formatMonthName(twoMonthsAgoDate),
      count: data.twoMonthsAgo,
    },
    {
      name: formatMonthName(lastMonthDate),
      count: data.lastMonth,
    },
    {
      name: formatMonthName(thisMonthDate),
      count: data.thisMonth,
    },
  ];

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.monthComparison')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value) => [value, t('history.purchases')]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => {
                let fillColor = '#8884d8';
                if (index === 1) fillColor = '#458fde';
                if (index === 2) fillColor = '#82ca9d';
                return <Cell key={`cell-${entry.name}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="month-comparison-summary">
        <span
          className={`change-indicator ${
            data.change >= 0 ? 'positive' : 'negative'
          }`}
        >
          {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change)}%{' '}
          {data.change >= 0 ? t('history.increase') : t('history.decrease')}
        </span>
      </div>
    </div>
  );
};

MonthComparisonChart.propTypes = {
  data: PropTypes.shape({
    thisMonth: PropTypes.number.isRequired,
    lastMonth: PropTypes.number.isRequired,
    twoMonthsAgo: PropTypes.number.isRequired,
    thisMonthName: PropTypes.string,
    lastMonthName: PropTypes.string,
    twoMonthsAgoName: PropTypes.string,
    change: PropTypes.number.isRequired,
  }).isRequired,
};

const HourOfDayChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = Array.from({ length: 24 }, (_, i) => {
    const found = data.find((d) => d.hour === i);
    return {
      hour: i,
      hourLabel: `${i}:00`,
      count: found ? found.count : 0,
    };
  });

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.hourOfDay')}</h3>
      <p className="chart-description">{t('history.hourOfDayDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="hourLabel"
              tick={{ fontSize: 10 }}
              tickFormatter={(label, index) => (index % 4 === 0 ? label : '')}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value) => [value, t('history.purchases')]}
              labelFormatter={(label) => `${t('history.hour')} ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

HourOfDayChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      hour: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const WEEKS_TO_SHOW = 5;
const UNCATEGORIZED_KEY = '__uncategorized__';

const parseWeeklyCategories = (week) => {
  let { categories } = week;
  if (typeof categories === 'string') {
    try {
      categories = JSON.parse(categories);
    } catch (e) {
      categories = [];
    }
  }
  if (!Array.isArray(categories)) {
    categories = [];
  }

  const parsed = categories
    .map((entry) => ({
      category: entry.category || 'Uncategorized',
      count: Number(entry.count) || 0,
    }))
    .filter((entry) => entry.count > 0);

  const count = Number(week.count) || 0;
  if (parsed.length === 0 && count > 0) {
    return [{ category: 'Uncategorized', count }];
  }

  return parsed;
};

const getWeeklyPreviousCount = (week) => {
  if (week.previousCount != null) {
    return Number(week.previousCount);
  }
  if (week.previous_count != null) {
    return Number(week.previous_count);
  }
  return null;
};

const getWeeklyChange = (count, previousCount) => {
  if (previousCount != null && previousCount > 0) {
    return Math.round(((count - previousCount) / previousCount) * 100);
  }
  if (count > 0 && previousCount === 0) {
    return 100;
  }
  return 0;
};

const getCategoryKey = (category) =>
  category === 'Uncategorized' ? UNCATEGORIZED_KEY : category;

const buildWeeklyComparisonChartData = (data) => {
  const weeks = data.slice(-WEEKS_TO_SHOW).map((week) => ({
    week: week.week,
    weekLabel: week.weekLabel || week.week_label,
    count: Number(week.count) || 0,
    previousCount: getWeeklyPreviousCount(week),
    categories: parseWeeklyCategories(week),
  }));

  if (weeks.length === 0) {
    return { chartData: [], categories: [], categoryLabels: {} };
  }

  const categoryTotals = {};
  weeks.forEach((week) => {
    week.categories.forEach(({ category, count }) => {
      categoryTotals[category] = (categoryTotals[category] || 0) + count;
    });
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const categoryLabels = Object.fromEntries(
    sortedCategories.map((category) => [getCategoryKey(category), category])
  );

  const chartData = weeks.map((item) => {
    const categoryMap = Object.fromEntries(
      item.categories.map(({ category, count }) => [category, count])
    );
    const row = {
      week: item.week,
      weekLabel: item.weekLabel,
      count: item.count,
      previousCount: item.previousCount,
      change: getWeeklyChange(item.count, item.previousCount),
    };
    sortedCategories.forEach((category) => {
      row[getCategoryKey(category)] = categoryMap[category] || 0;
    });
    return row;
  });

  return {
    chartData,
    categories: sortedCategories.map(getCategoryKey),
    categoryLabels,
  };
};

const WeeklyComparisonTooltip = ({ active, payload, categoryLabels, t }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;
  const segments = payload
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
  let changeText = null;
  if (data.previousCount != null) {
    const sign = data.change >= 0 ? '+' : '';
    changeText = `${sign}${data.change}%`;
  }

  const getLabel = (dataKey) => categoryLabels[dataKey] || dataKey;

  return (
    <div
      className="weekly-comparison-tooltip"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px 12px',
        fontSize: '12px',
      }}
    >
      <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{data.weekLabel}</p>
      <p style={{ margin: '2px 0', color: '#333' }}>
        {t('history.products')}: {data.count}
      </p>
      {segments.map((entry) => (
        <p key={entry.dataKey} style={{ margin: '2px 0', color: entry.color }}>
          {getLabel(entry.dataKey)}: {entry.value}
        </p>
      ))}
      {changeText && (
        <p style={{ margin: '6px 0 0', color: '#666' }}>
          {t('history.weekChange')}: {changeText}
        </p>
      )}
    </div>
  );
};

WeeklyComparisonTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  categoryLabels: PropTypes.objectOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired,
};

const WeeklyComparisonChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const { chartData, categories, categoryLabels } =
    buildWeeklyComparisonChartData(data);
  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.weeklyComparison')}</h3>
      <p className="chart-description">{t('history.weeklyComparisonDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} allowDecimals={false} />
            <Tooltip
              content={
                <WeeklyComparisonTooltip categoryLabels={categoryLabels} t={t} />
              }
            />
            {categories.map((categoryKey, index) => {
              const label = categoryLabels[categoryKey] || categoryKey;
              return (
                <Bar
                  key={categoryKey}
                  dataKey={categoryKey}
                  name={
                    label.length > 14 ? `${label.slice(0, 14)}...` : label
                  }
                  stackId="weekly"
                  fill={COLORS[index % COLORS.length]}
                  radius={
                    index === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                  }
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

WeeklyComparisonChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      week: PropTypes.string.isRequired,
      weekLabel: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      previousCount: PropTypes.number,
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string.isRequired,
          count: PropTypes.number.isRequired,
        })
      ),
    })
  ).isRequired,
};

const SeasonalTrendsChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const years = [...new Set(data.map((d) => d.year))].sort();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const chartData = months.map((month) => {
    const point = {
      month,
      name: formatMonthWithTranslation(
        `2024-${String(month).padStart(2, '0')}`,
        t
      ),
    };
    years.forEach((year) => {
      const found = data.find((d) => d.year === year && d.month === month);
      point[year] = found ? found.count : null;
    });
    return point;
  });

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.seasonalTrends')}</h3>
      <p className="chart-description">{t('history.seasonalTrendsDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
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
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {years.map((year, index) => (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

SeasonalTrendsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      yearMonth: PropTypes.string.isRequired,
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
              <th>{t('history.lastPurchase')}</th>
              <th>{t('history.predictedRestockDate')}</th>
              <th>{t('history.status')}</th>
              <th>{t('history.restockColumnTimesBought')}</th>
              <th>{t('history.restockColumnAvgInterval')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.name}
                className={
                  item.highlighted ? 'restock-row--frequent' : undefined
                }
              >
                <td className="restock-cell-product">
                  <span className="restock-product-name">{item.name}</span>
                  {item.highlighted && (
                    <span className="restock-frequent-badge">
                      {t('history.restockFrequentBuy')}
                    </span>
                  )}
                </td>
                <td>{formatDate(item.lastPurchase)}</td>
                <td>{formatDate(item.predictedRestockDate)}</td>
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
      lastPurchase: PropTypes.string.isRequired,
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

const ShoppingTripFrequencyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.shoppingTripFrequency')}</h3>
      <p className="chart-description">
        {t('history.shoppingTripFrequencyDesc')}
      </p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value) => [value, t('history.trips')]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar
              dataKey="tripCount"
              fill="#00C49F"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ShoppingTripFrequencyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      week: PropTypes.string.isRequired,
      weekLabel: PropTypes.string.isRequired,
      tripCount: PropTypes.number.isRequired,
    })
  ).isRequired,
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

const CategoryVarietyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const categoryTotals = {};
  data.forEach(({ category, distinctProducts }) => {
    if (!categoryTotals[category]) {
      categoryTotals[category] = { total: 0, months: 0 };
    }
    categoryTotals[category].total += distinctProducts;
    categoryTotals[category].months += 1;
  });

  const chartData = Object.entries(categoryTotals)
    .map(([category, { total, months }]) => ({
      name: category.length > 14 ? `${category.slice(0, 14)}...` : category,
      fullName: category,
      avgVariety: Math.round(total / months),
    }))
    .sort((a, b) => b.avgVariety - a.avgVariety)
    .slice(0, 10);

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.categoryVariety')}</h3>
      <p className="chart-description">{t('history.categoryVarietyDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10 }}
              width={85}
            />
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
            <Bar dataKey="avgVariety" fill="#ffc658" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CategoryVarietyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      distinctProducts: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const ProductAdoptionCards = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.totalLinkedPurchases === 0) {
    return null;
  }

  const adoptionRate =
    data.totalLinkedPurchases > 0
      ? Math.round((data.firstTimeCount / data.totalLinkedPurchases) * 100)
      : 0;
  const repeatRate = 100 - adoptionRate;

  return (
    <div className="stats-section">
      <h3>{t('history.productAdoption')}</h3>
      <p className="chart-description">{t('history.productAdoptionDesc')}</p>
      <div className="overview-cards adoption-cards">
        <StatCard
          value={`${adoptionRate}%`}
          label={t('history.firstTimePurchases')}
          icon="🆕"
          color="#82ca9d"
        />
        <StatCard
          value={`${repeatRate}%`}
          label={t('history.repeatPurchases')}
          icon="🔁"
          color="#458fde"
        />
        <StatCard
          value={data.newProductsAdded}
          label={t('history.newProductsAdded')}
          icon="📦"
          color="#ffc658"
        />
        <StatCard
          value={data.totalProducts}
          label={t('history.totalProductsInCatalog')}
          icon="🏷️"
          color="#8884d8"
        />
      </div>
    </div>
  );
};

ProductAdoptionCards.propTypes = {
  data: PropTypes.shape({
    firstTimeCount: PropTypes.number.isRequired,
    totalLinkedPurchases: PropTypes.number.isRequired,
    newProductsAdded: PropTypes.number.isRequired,
    totalProducts: PropTypes.number.isRequired,
  }).isRequired,
};

const AbandonedProductsList = ({ data, totalCount }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

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
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.name}>
                <td className="restock-cell-product">{item.name}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  {item.lastPurchase
                    ? formatDate(item.lastPurchase)
                    : t('history.neverPurchased')}
                </td>
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
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string,
      lastPurchase: PropTypes.string,
    })
  ).isRequired,
  totalCount: PropTypes.number.isRequired,
};

const Statistics = ({ history }) => {
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
        monthComparison={history.monthComparison}
      />

      <StatsSectionTitle>
        {t('history.sectionPurchasingTrends')}
      </StatsSectionTitle>
      <div className="charts-grid">
        <SeasonalTrendsChart data={history.seasonalTrends || []} />
        <WeeklyComparisonChart data={history.weeklyComparison || []} />
      </div>

      <StatsSectionTitle>
        {t('history.sectionShoppingRhythm')}
      </StatsSectionTitle>
      <div className="charts-grid">
        <ShoppingTripFrequencyChart
          data={history.shoppingTripFrequency || []}
        />
        <DayOfWeekChart data={history.dayOfWeekStats} />
        <HourOfDayChart data={history.hourOfDay || []} />
      </div>
      <ShoppingHeatmap data={history.shoppingHeatmap || []} />

      <ProductRestockPredictions
        data={history.productRestockPredictions || []}
      />

      <StatsSectionTitle>{t('history.sectionVolume')}</StatsSectionTitle>
      <div className="charts-grid">
        <ProductPurchaseBarChart data={history.mostBoughtItems} />
        <CategoryVarietyChart data={history.categoryVariety || []} />
        <MostBoughtList
          data={history.mostBoughtItems}
          dateRange={history.dateRange}
        />
      </div>

      <StatsSectionTitle>{t('history.sectionLifecycle')}</StatsSectionTitle>
      <ProductAdoptionCards data={history.productAdoption} />
      <AbandonedProductsList
        data={history.abandonedProducts || []}
        totalCount={history.abandonedProductsCount || 0}
      />
    </div>
  );
};

Statistics.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Statistics;
