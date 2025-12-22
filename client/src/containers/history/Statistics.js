import React from 'react';
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
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
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
  const date = new Date(dateStr);
  return date.toLocaleDateString();
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
        value={purchaseFrequency.itemsPerWeek}
        label={t('history.itemsPerWeek')}
        icon="📊"
        color="#ffc658"
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
  mostActiveDay: PropTypes.string,
  purchaseFrequency: PropTypes.shape({
    itemsPerWeek: PropTypes.number.isRequired,
    itemsPerMonth: PropTypes.number.isRequired,
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

// Helper function for product pie chart tooltip
const formatProductTooltip = (total) => (value, name, tooltipProps) => {
  const productName = tooltipProps?.payload?.name || name || '';
  return [`${value} (${((value / total) * 100).toFixed(1)}%)`, productName];
};

const ProductPurchasePieChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const topItems = data.slice(0, 8);
  const othersCount = data.slice(8).reduce((sum, item) => sum + item.count, 0);

  const chartData =
    othersCount > 0
      ? [...topItems, { name: t('history.others'), count: othersCount }]
      : topItems;

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.productPieChart')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="count"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={formatProductTooltip(total)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ProductPurchasePieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const ProductTrendChart = ({ data, monthlyPurchases }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const months = monthlyPurchases.map((m) => m.month).sort();
  const products = [...new Set(data.map((d) => d.product))];

  const chartData = months.map((month) => {
    const point = { month, name: formatMonthWithTranslation(month, t) };
    products.forEach((product) => {
      const found = data.find(
        (d) => d.product === product && d.month === month
      );
      point[product] = found ? found.count : 0;
    });
    return point;
  });

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.productTrendChart')}</h3>
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
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {products.map((product, index) => (
              <Line
                key={product}
                type="monotone"
                dataKey={product}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ProductTrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  monthlyPurchases: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

// Helper function for category distribution chart tooltip
const formatCategoryTooltip = (total) => (value, name, tooltipProps) => {
  const categoryName = tooltipProps?.payload?.name || name || '';
  return [`${value} (${((value / total) * 100).toFixed(1)}%)`, categoryName];
};

const CategoryDistributionChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.categoryDistribution')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="count"
              nameKey="name"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={formatCategoryTooltip(total)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CategoryDistributionChart.propTypes = {
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

const DayOfMonthChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const found = data.find((d) => d.day === day);
    return {
      day,
      count: found ? found.count : 0,
    };
  });

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.dayOfMonthChart')}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              tickFormatter={(d) => (d % 5 === 0 || d === 1 ? d : '')}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value) => [value, t('history.purchases')]}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#458fde"
              fill="#c3e6fc"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

DayOfMonthChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const PurchaseHeatmap = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const weeks = [];
  let currentWeek = [];
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  sortedData.forEach((d) => {
    const date = new Date(d.date);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(d);
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getColor = (count) => {
    if (count === 0) return '#ebedf0';
    const intensity = count / maxCount;
    if (intensity > 0.75) return '#216e39';
    if (intensity > 0.5) return '#30a14e';
    if (intensity > 0.25) return '#40c463';
    return '#9be9a8';
  };

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.purchaseHeatmap')}</h3>
      <div className="heatmap-container">
        <div className="heatmap-grid">
          {weeks.slice(-13).map((week, weekIndex) => (
            <div
              key={`week-${week[0]?.date || weekIndex}`}
              className="heatmap-week"
            >
              {week.map((d) => (
                <div
                  key={d.date}
                  className="heatmap-day"
                  style={{ backgroundColor: getColor(d.count) }}
                  title={`${d.date}: ${d.count} purchases`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span>{t('history.less')}</span>
          <div className="heatmap-day" style={{ backgroundColor: '#ebedf0' }} />
          <div className="heatmap-day" style={{ backgroundColor: '#9be9a8' }} />
          <div className="heatmap-day" style={{ backgroundColor: '#40c463' }} />
          <div className="heatmap-day" style={{ backgroundColor: '#30a14e' }} />
          <div className="heatmap-day" style={{ backgroundColor: '#216e39' }} />
          <span>{t('history.more')}</span>
        </div>
      </div>
    </div>
  );
};

PurchaseHeatmap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
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

const FrequencyDistributionChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.frequencyDistribution')}</h3>
      <p className="chart-description">
        {t('history.frequencyDistributionDesc')}
      </p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value) => [value, t('history.purchases')]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="count" fill="#458fde" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

FrequencyDistributionChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      bucket: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const ProductFrequencyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.slice(0, 15).map((item) => ({
    name: item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name,
    fullName: item.name,
    avgDays: item.avgDays,
    count: item.count,
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.productFrequency')}</h3>
      <p className="chart-description">{t('history.productFrequencyDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10 }}
              width={95}
            />
            <Tooltip
              formatter={(value, _name, { payload }) => [
                `${value} ${t('history.days')}`,
                payload.fullName,
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="avgDays" fill="#82ca9d" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ProductFrequencyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avgDays: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const IntervalTrendChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    ...item,
    name: formatMonthWithTranslation(item.month, t),
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.intervalTrend')}</h3>
      <p className="chart-description">{t('history.intervalTrendDesc')}</p>
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
              formatter={(value) => [
                `${value} ${t('history.days')}`,
                t('history.avgDays'),
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Line
              type="monotone"
              dataKey="avgDays"
              stroke="#ffc658"
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

IntervalTrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      avgDays: PropTypes.number.isRequired,
    })
  ).isRequired,
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

const WeeklyComparisonChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    ...item,
    change: item.previousCount
      ? Math.round(
          ((item.count - item.previousCount) / item.previousCount) * 100
        )
      : 0,
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.weeklyComparison')}</h3>
      <p className="chart-description">{t('history.weeklyComparisonDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
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
              formatter={(value, name, { payload }) => {
                if (name === 'count') {
                  return [value, t('history.purchases')];
                }
                return [
                  payload.change >= 0
                    ? `+${payload.change}%`
                    : `${payload.change}%`,
                  t('history.weekChange'),
                ];
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => {
                let fillColor = '#8884d8';
                if (entry.change > 0) fillColor = '#82ca9d';
                if (entry.change < 0) fillColor = '#ff7c7c';
                return <Cell key={`cell-${entry.week}`} fill={fillColor} />;
              })}
            </Bar>
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

const CategoryFrequencyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    name: item.name,
    avgDaysBetween: parseFloat(item.avgDaysBetween),
    purchaseCount: item.purchaseCount,
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.categoryFrequency')}</h3>
      <p className="chart-description">{t('history.categoryFrequencyDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              width={95}
            />
            <Tooltip
              formatter={(value) => [
                `${value} ${t('history.days')}`,
                t('history.avgDays'),
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar
              dataKey="avgDaysBetween"
              fill="#00C49F"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CategoryFrequencyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avgDaysBetween: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      purchaseCount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const ProductLifecycleChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.slice(0, 10).map((item) => ({
    name: item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name,
    fullName: item.name,
    daysActive: item.daysActive,
    count: item.count,
    firstPurchase: formatDate(item.firstPurchase),
    lastPurchase: formatDate(item.lastPurchase),
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.productLifecycle')}</h3>
      <p className="chart-description">{t('history.productLifecycleDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10 }}
              width={95}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'daysActive') {
                  return [
                    `${value} ${t('history.days')}`,
                    t('history.daysActive'),
                  ];
                }
                return [value, t('history.purchases')];
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="daysActive" fill="#FF8042" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ProductLifecycleChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      firstPurchase: PropTypes.string.isRequired,
      lastPurchase: PropTypes.string.isRequired,
      daysActive: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const PurchaseVelocityChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="stats-section chart-section">
      <h3>{t('history.purchaseVelocity')}</h3>
      <p className="chart-description">{t('history.purchaseVelocityDesc')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              formatter={(value, name) => {
                const label =
                  name === 'dailyCount'
                    ? t('history.dailyCount')
                    : t('history.movingAvg');
                return [value, label];
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area
              type="monotone"
              dataKey="dailyCount"
              stroke="#458fde"
              fill="#c3e6fc"
              strokeWidth={1}
              name={t('history.dailyCount')}
            />
            <Area
              type="monotone"
              dataKey="movingAvg7d"
              stroke="#ff7c7c"
              fill="#ffcccc"
              strokeWidth={2}
              name={t('history.movingAvg')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

PurchaseVelocityChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      dailyCount: PropTypes.number.isRequired,
      movingAvg7d: PropTypes.number,
    })
  ).isRequired,
};

const IntervalsSummary = ({ data }) => {
  const { t } = useTranslation();
  if (
    !data ||
    Object.keys(data).length === 0 ||
    data.min === null ||
    data.min === undefined
  ) {
    return null;
  }

  const stats = [
    { label: t('history.min'), value: data.min || 0, color: '#ff7c7c' },
    { label: t('history.q1'), value: data.q1 || 0, color: '#ffc658' },
    { label: t('history.median'), value: data.median || 0, color: '#458fde' },
    { label: t('history.q3'), value: data.q3 || 0, color: '#ffc658' },
    { label: t('history.max'), value: data.max || 0, color: '#ff7c7c' },
    { label: t('history.avg'), value: data.avg || 0, color: '#82ca9d' },
  ];

  return (
    <div className="stats-section">
      <h3>{t('history.intervalsSummary')}</h3>
      <p className="chart-description">{t('history.intervalsSummaryDesc')}</p>
      <div className="intervals-summary-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="interval-stat-card">
            <span className="interval-stat-label">{stat.label}</span>
            <span className="interval-stat-value" style={{ color: stat.color }}>
              {stat.value} {t('history.days')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

IntervalsSummary.propTypes = {
  data: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    avg: PropTypes.number,
    q1: PropTypes.number,
    median: PropTypes.number,
    q3: PropTypes.number,
  }).isRequired,
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
      {/* Overview Section */}
      <OverviewCards
        totalPurchases={history.totalPurchases}
        mostActiveDay={history.mostActiveDay}
        purchaseFrequency={history.purchaseFrequency}
        monthComparison={history.monthComparison}
      />

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Row 1: Monthly trend and comparison */}
        <MonthlyChart data={history.monthlyPurchases} />
        <MonthComparisonChart data={history.monthComparison} />

        {/* Row 2: Product analysis */}
        <ProductPurchaseBarChart data={history.mostBoughtItems} />
        <ProductPurchasePieChart data={history.mostBoughtItems} />

        {/* Row 3: Product trends and category */}
        <ProductTrendChart
          data={history.productTrends}
          monthlyPurchases={history.monthlyPurchases}
        />
        <CategoryDistributionChart data={history.categoryDistribution} />

        {/* Row 4: Temporal patterns */}
        <DayOfWeekChart data={history.dayOfWeekStats} />

        {/* Row 5: Heatmap */}
        <PurchaseHeatmap data={history.dailyPurchases} />

        {/* Row 6: Frequency analysis */}
        <FrequencyDistributionChart
          data={history.frequencyDistribution || []}
        />
        <IntervalsSummary data={history.intervalsSummary || {}} />

        {/* Row 7: Product frequency */}
        <ProductFrequencyChart data={history.productFrequency || []} />
        <IntervalTrendChart data={history.intervalTrend || []} />

        {/* Row 8: Time-based analysis */}
        <HourOfDayChart data={history.hourOfDay || []} />
        <WeeklyComparisonChart data={history.weeklyComparison || []} />

        {/* Row 9: Seasonal and category analysis */}
        <SeasonalTrendsChart data={history.seasonalTrends || []} />
        <CategoryFrequencyChart data={history.categoryFrequency || []} />

        {/* Row 10: Product lifecycle and velocity */}
        <ProductLifecycleChart data={history.productLifecycle || []} />
        <PurchaseVelocityChart data={history.purchaseVelocity || []} />
      </div>
    </div>
  );
};

Statistics.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Statistics;
