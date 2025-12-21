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

// Overview Stat Cards
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
  mostActiveDay,
  purchaseFrequency,
  monthComparison,
}) => {
  const { t } = useTranslation();
  const changeIndicator =
    monthComparison.change >= 0
      ? `+${monthComparison.change}%`
      : `${monthComparison.change}%`;

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
        value={mostActiveDay || '-'}
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

OverviewCards.defaultProps = {
  mostActiveDay: null,
};

// Monthly Purchases Line Chart
const MonthlyChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    ...item,
    name: formatMonth(item.month),
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

// Product Purchase Bar Chart (Horizontal)
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

// Product Purchase Pie Chart
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

// Product Trend Chart (Multi-line)
const ProductTrendChart = ({ data, monthlyPurchases }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  // Get all months from the monthly purchases for x-axis
  const months = monthlyPurchases.map((m) => m.month).sort();

  // Get unique products
  const products = [...new Set(data.map((d) => d.product))];

  // Transform data for recharts
  const chartData = months.map((month) => {
    const point = { month, name: formatMonth(month) };
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

// Category Distribution Chart
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

// Day of Week Chart
const DayOfWeekChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

// Day of Month Chart
const DayOfMonthChart = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  // Fill in all days 1-31
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

// Purchase Heatmap (Calendar Style)
const PurchaseHeatmap = ({ data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  // Group by week
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

// Month Comparison Chart
const MonthComparisonChart = ({ data }) => {
  const { t } = useTranslation();

  const chartData = [
    {
      name: data.twoMonthsAgoName || t('history.twoMonthsAgo'),
      count: data.twoMonthsAgo,
    },
    {
      name: data.lastMonthName || t('history.lastMonth'),
      count: data.lastMonth,
    },
    {
      name: data.thisMonthName || t('history.thisMonth'),
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
                let fillColor = '#8884d8'; // Default: two months ago
                if (index === 1) fillColor = '#458fde'; // Last month
                if (index === 2) fillColor = '#82ca9d'; // This month
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

// Most Bought Items List
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

// Main Statistics Display Component
const StatisticsDisplay = ({
  loading,
  totalPurchases,
  purchaseFrequency,
  mostBoughtItems,
  monthlyPurchases,
  categoryDistribution,
  dayOfWeekStats,
  productTrends,
  monthComparison,
  mostActiveDay,
  dailyPurchases,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="statistics-display">
        <p>{t('history.loading')}</p>
      </div>
    );
  }

  if (totalPurchases === 0) {
    return (
      <div className="statistics-display">
        <p>{t('history.noData')}</p>
      </div>
    );
  }

  return (
    <div className="statistics-display">
      {/* Overview Section */}
      <OverviewCards
        totalPurchases={totalPurchases}
        mostActiveDay={mostActiveDay}
        purchaseFrequency={purchaseFrequency}
        monthComparison={monthComparison}
      />

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Row 1: Monthly trend and comparison */}
        <MonthlyChart data={monthlyPurchases} />
        <MonthComparisonChart data={monthComparison} />

        {/* Row 2: Product analysis */}
        <ProductPurchaseBarChart data={mostBoughtItems} />
        <ProductPurchasePieChart data={mostBoughtItems} />

        {/* Row 3: Product trends and category */}
        <ProductTrendChart
          data={productTrends}
          monthlyPurchases={monthlyPurchases}
        />
        <CategoryDistributionChart data={categoryDistribution} />

        {/* Row 4: Temporal patterns */}
        <DayOfWeekChart data={dayOfWeekStats} />

        {/* Row 5: Heatmap */}
        <PurchaseHeatmap data={dailyPurchases} />
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
};

StatisticsDisplay.defaultProps = {
  mostActiveDay: null,
};

export default StatisticsDisplay;
