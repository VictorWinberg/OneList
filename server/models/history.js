module.exports = (client) => ({
  recordPurchases(userId, items, done) {
    if (!items || items.length === 0) {
      return done(null, []);
    }

    const values = items
      .map((item, idx) => {
        const offset = idx * 5;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${
          offset + 4
        }, $${offset + 5})`;
      })
      .join(', ');

    const params = items.flatMap((item) => [
      item.product_id,
      item.product_name,
      item.category_id || null,
      userId,
      new Date(),
    ]);

    const sql = `
      INSERT INTO product_purchases (product_id, product_name, category_id, user_id, purchased_at)
      VALUES ${values}
      RETURNING *`;

    client
      .query(sql, params)
      .then(({ rows }) => done(null, rows))
      .catch((err) => done({ ...err, stack: err.stack }));
  },

  getStatistics(done) {
    const sql = `
      WITH stats AS (
        SELECT
          COUNT(*) as total_purchases,
          MIN(purchased_at) as first_purchase,
          MAX(purchased_at) as last_purchase,
          COUNT(DISTINCT product_name) as unique_products
        FROM product_purchases
      ),
      most_bought AS (
        SELECT
          product_name,
          COUNT(*) as purchase_count
        FROM product_purchases
        GROUP BY product_name
        ORDER BY purchase_count DESC
        LIMIT 20
      ),
      monthly AS (
        SELECT
          TO_CHAR(purchased_at, 'YYYY-MM') as month,
          COUNT(*) as count
        FROM product_purchases
        WHERE purchased_at >= NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(purchased_at, 'YYYY-MM')
        ORDER BY month
      ),
      category_stats AS (
        SELECT
          COALESCE(c.name, 'Uncategorized') as category_name,
          COUNT(*) as count
        FROM product_purchases pp
        LEFT JOIN categories c ON pp.category_id = c.id
        GROUP BY COALESCE(c.name, 'Uncategorized')
        ORDER BY count DESC
      ),
      day_of_week AS (
        SELECT
          EXTRACT(DOW FROM purchased_at) as day_num,
          TO_CHAR(purchased_at, 'Day') as day_name,
          COUNT(*) as count
        FROM product_purchases
        GROUP BY EXTRACT(DOW FROM purchased_at), TO_CHAR(purchased_at, 'Day')
        ORDER BY day_num
      ),
      day_of_month AS (
        SELECT
          EXTRACT(DAY FROM purchased_at)::int as day,
          COUNT(*) as count
        FROM product_purchases
        GROUP BY EXTRACT(DAY FROM purchased_at)
        ORDER BY day
      ),
      top_products AS (
        SELECT product_name
        FROM product_purchases
        GROUP BY product_name
        ORDER BY COUNT(*) DESC
        LIMIT 5
      ),
      product_trends AS (
        SELECT
          pp.product_name,
          TO_CHAR(pp.purchased_at, 'YYYY-MM') as month,
          COUNT(*) as count
        FROM product_purchases pp
        WHERE pp.product_name IN (SELECT product_name FROM top_products)
          AND pp.purchased_at >= NOW() - INTERVAL '12 months'
        GROUP BY pp.product_name, TO_CHAR(pp.purchased_at, 'YYYY-MM')
        ORDER BY pp.product_name, month
      ),
      this_month AS (
        SELECT COUNT(*) as count
        FROM product_purchases
        WHERE DATE_TRUNC('month', purchased_at) = DATE_TRUNC('month', NOW())
      ),
      last_month AS (
        SELECT COUNT(*) as count
        FROM product_purchases
        WHERE DATE_TRUNC('month', purchased_at) = DATE_TRUNC('month', NOW() - INTERVAL '1 month')
      ),
      two_months_ago AS (
        SELECT COUNT(*) as count
        FROM product_purchases
        WHERE DATE_TRUNC('month', purchased_at) = DATE_TRUNC('month', NOW() - INTERVAL '2 months')
      ),
      daily_purchases AS (
        SELECT DATE(purchased_at) as purchase_date, COUNT(*) as count
        FROM product_purchases
        WHERE purchased_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE(purchased_at)
        ORDER BY purchase_date
      ),
      -- Purchase intervals: days between consecutive purchases
      purchase_intervals AS (
        SELECT
          DATE(purchased_at) as purchase_date,
          (DATE(purchased_at) - LAG(DATE(purchased_at)) OVER (ORDER BY DATE(purchased_at)))::int as days_between
        FROM product_purchases
        WHERE purchased_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE(purchased_at)
      ),
      -- Purchase frequency distribution (bucketed intervals)
      frequency_distribution AS (
        SELECT interval_bucket, count
        FROM (
          SELECT
            CASE
              WHEN days_between IS NULL THEN '0'
              WHEN days_between <= 1 THEN '0-1'
              WHEN days_between <= 3 THEN '2-3'
              WHEN days_between <= 7 THEN '4-7'
              WHEN days_between <= 14 THEN '8-14'
              WHEN days_between <= 30 THEN '15-30'
              ELSE '30+'
            END as interval_bucket,
            COUNT(*) as count
          FROM purchase_intervals
          WHERE days_between IS NOT NULL
          GROUP BY
            CASE
              WHEN days_between IS NULL THEN '0'
              WHEN days_between <= 1 THEN '0-1'
              WHEN days_between <= 3 THEN '2-3'
              WHEN days_between <= 7 THEN '4-7'
              WHEN days_between <= 14 THEN '8-14'
              WHEN days_between <= 30 THEN '15-30'
              ELSE '30+'
            END
        ) grouped
        ORDER BY
          CASE interval_bucket
            WHEN '0' THEN 0
            WHEN '0-1' THEN 1
            WHEN '2-3' THEN 2
            WHEN '4-7' THEN 3
            WHEN '8-14' THEN 4
            WHEN '15-30' THEN 5
            WHEN '30+' THEN 6
          END
      ),
      -- Product purchase frequency (average days between purchases per product)
      product_frequency AS (
        WITH product_purchase_dates AS (
          SELECT
            product_name,
            DATE(purchased_at) as purchase_date,
            DATE(purchased_at) - LAG(DATE(purchased_at)) OVER (PARTITION BY product_name ORDER BY DATE(purchased_at)) as days_between
          FROM product_purchases
          WHERE purchased_at >= NOW() - INTERVAL '12 months'
        ),
        product_avg_intervals AS (
          SELECT
            product_name,
            AVG(days_between)::int as avg_days_between,
            COUNT(*) as purchase_count
          FROM product_purchase_dates
          WHERE days_between IS NOT NULL
          GROUP BY product_name
          HAVING COUNT(*) > 1
        )
        SELECT
          product_name as name,
          avg_days_between as avg_days,
          purchase_count as count
        FROM product_avg_intervals
        ORDER BY avg_days_between ASC, purchase_count DESC
        LIMIT 20
      ),
      -- Time between purchases trend (monthly average)
      interval_trend AS (
        WITH monthly_intervals AS (
          SELECT
            TO_CHAR(purchase_date, 'YYYY-MM') as month,
            AVG(days_between) as avg_days
          FROM purchase_intervals
          WHERE days_between IS NOT NULL
          GROUP BY TO_CHAR(purchase_date, 'YYYY-MM')
        )
        SELECT month, ROUND(avg_days::numeric, 1) as avg_days
        FROM monthly_intervals
        ORDER BY month
      ),
      hour_of_day AS (
        SELECT
          EXTRACT(HOUR FROM purchased_at)::int as hour,
          COUNT(*) as count
        FROM product_purchases
        WHERE purchased_at >= NOW() - INTERVAL '12 months'
        GROUP BY EXTRACT(HOUR FROM purchased_at)
        ORDER BY hour
      ),
      weekly_comparison AS (
        WITH weekly_stats AS (
          SELECT
            DATE_TRUNC('week', purchased_at) as week_start,
            COUNT(*) as count
          FROM product_purchases
          WHERE purchased_at >= NOW() - INTERVAL '12 weeks'
          GROUP BY DATE_TRUNC('week', purchased_at)
          ORDER BY week_start DESC
          LIMIT 12
        )
        SELECT
          TO_CHAR(week_start, 'YYYY-MM-DD') as week,
          TO_CHAR(week_start, 'Mon DD') as week_label,
          count,
          LAG(count) OVER (ORDER BY week_start) as previous_count
        FROM weekly_stats
        ORDER BY week_start
      ),
      seasonal_trends AS (
        SELECT
          EXTRACT(YEAR FROM purchased_at)::int as year,
          EXTRACT(MONTH FROM purchased_at)::int as month,
          TO_CHAR(purchased_at, 'YYYY-MM') as year_month,
          COUNT(*) as count
        FROM product_purchases
        WHERE purchased_at >= NOW() - INTERVAL '24 months'
        GROUP BY EXTRACT(YEAR FROM purchased_at), EXTRACT(MONTH FROM purchased_at), TO_CHAR(purchased_at, 'YYYY-MM')
        ORDER BY year, month
      ),
      category_frequency AS (
        WITH category_purchase_dates AS (
          SELECT
            COALESCE(c.name, 'Uncategorized') as category_name,
            DATE(pp.purchased_at) as purchase_date,
            DATE(pp.purchased_at) - LAG(DATE(pp.purchased_at)) OVER (PARTITION BY COALESCE(c.name, 'Uncategorized') ORDER BY DATE(pp.purchased_at)) as days_between
          FROM product_purchases pp
          LEFT JOIN categories c ON pp.category_id = c.id
          WHERE pp.purchased_at >= NOW() - INTERVAL '12 months'
        )
        SELECT
          category_name as name,
          ROUND(AVG(days_between)::numeric, 1) as avg_days_between,
          COUNT(*) as purchase_count
        FROM category_purchase_dates
        WHERE days_between IS NOT NULL
        GROUP BY category_name
        HAVING COUNT(*) > 1
        ORDER BY avg_days_between ASC
      ),
      product_lifecycle AS (
        WITH product_first_last AS (
          SELECT
            product_name,
            MIN(purchased_at) as first_purchase,
            MAX(purchased_at) as last_purchase,
            COUNT(*) as purchase_count
          FROM product_purchases
          GROUP BY product_name
          HAVING COUNT(*) > 1
        )
        SELECT
          product_name as name,
          first_purchase,
          last_purchase,
          (DATE(last_purchase) - DATE(first_purchase))::int as days_active,
          purchase_count as count
        FROM product_first_last
        ORDER BY purchase_count DESC, days_active DESC
        LIMIT 20
      ),
      -- Purchase velocity (purchases per day over time with moving average)
      purchase_velocity AS (
        WITH daily_counts AS (
          SELECT
            DATE(purchased_at) as purchase_date,
            COUNT(*) as daily_count
          FROM product_purchases
          WHERE purchased_at >= NOW() - INTERVAL '90 days'
          GROUP BY DATE(purchased_at)
          ORDER BY purchase_date
        )
        SELECT
          purchase_date as date,
          daily_count,
          ROUND(AVG(daily_count) OVER (ORDER BY purchase_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)::numeric, 1) as moving_avg_7d
        FROM daily_counts
        ORDER BY purchase_date
      ),
      intervals_summary AS (
        SELECT
          MIN(days_between)::int as min_interval,
          MAX(days_between)::int as max_interval,
          ROUND(AVG(days_between)::numeric, 1) as avg_interval,
          ROUND((PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY days_between))::numeric, 1) as q1_interval,
          ROUND((PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_between))::numeric, 1) as median_interval,
          ROUND((PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY days_between))::numeric, 1) as q3_interval
        FROM purchase_intervals
        WHERE days_between IS NOT NULL AND days_between > 0
      )
      SELECT
        stats.total_purchases,
        stats.first_purchase,
        stats.last_purchase,
        stats.unique_products,
        COALESCE(
          (SELECT json_agg(json_build_object('name', product_name, 'count', purchase_count)) FROM most_bought),
          '[]'
        ) as most_bought_items,
        COALESCE(
          (SELECT json_agg(json_build_object('month', month, 'count', count)) FROM monthly),
          '[]'
        ) as monthly_purchases,
        COALESCE(
          (SELECT json_agg(json_build_object('name', category_name, 'count', count)) FROM category_stats),
          '[]'
        ) as category_distribution,
        COALESCE(
          (SELECT json_agg(json_build_object('day', day_num, 'name', TRIM(day_name), 'count', count)) FROM day_of_week),
          '[]'
        ) as day_of_week_stats,
        COALESCE(
          (SELECT json_agg(json_build_object('day', day, 'count', count)) FROM day_of_month),
          '[]'
        ) as day_of_month_stats,
        COALESCE(
          (SELECT json_agg(json_build_object('product', product_name, 'month', month, 'count', count)) FROM product_trends),
          '[]'
        ) as product_trends,
        (SELECT count FROM this_month) as this_month_count,
        (SELECT count FROM last_month) as last_month_count,
        (SELECT count FROM two_months_ago) as two_months_ago_count,
        COALESCE(
          (SELECT json_agg(json_build_object('date', purchase_date, 'count', count)) FROM daily_purchases),
          '[]'
        ) as daily_purchases,
        COALESCE(
          (SELECT json_agg(json_build_object('bucket', interval_bucket, 'count', count)) FROM frequency_distribution),
          '[]'
        ) as frequency_distribution,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'avgDays', avg_days, 'count', count)) FROM product_frequency),
          '[]'
        ) as product_frequency,
        COALESCE(
          (SELECT json_agg(json_build_object('month', month, 'avgDays', avg_days)) FROM interval_trend),
          '[]'
        ) as interval_trend,
        COALESCE(
          (SELECT json_agg(json_build_object('hour', hour, 'count', count)) FROM hour_of_day),
          '[]'
        ) as hour_of_day,
        COALESCE(
          (SELECT json_agg(json_build_object('week', week, 'weekLabel', week_label, 'count', count, 'previousCount', previous_count)) FROM weekly_comparison),
          '[]'
        ) as weekly_comparison,
        COALESCE(
          (SELECT json_agg(json_build_object('year', year, 'month', month, 'yearMonth', year_month, 'count', count)) FROM seasonal_trends),
          '[]'
        ) as seasonal_trends,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'avgDaysBetween', avg_days_between, 'purchaseCount', purchase_count)) FROM category_frequency),
          '[]'
        ) as category_frequency,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'firstPurchase', first_purchase, 'lastPurchase', last_purchase, 'daysActive', days_active, 'count', count)) FROM product_lifecycle),
          '[]'
        ) as product_lifecycle,
        COALESCE(
          (SELECT json_agg(json_build_object('date', date, 'dailyCount', daily_count, 'movingAvg7d', moving_avg_7d)) FROM purchase_velocity),
          '[]'
        ) as purchase_velocity,
        (SELECT json_build_object(
          'min', min_interval,
          'max', max_interval,
          'avg', avg_interval,
          'q1', q1_interval,
          'median', median_interval,
          'q3', q3_interval
        ) FROM intervals_summary) as intervals_summary
      FROM stats
      GROUP BY stats.total_purchases, stats.first_purchase, stats.last_purchase, stats.unique_products`;

    client
      .query(sql)
      .then(({ rows }) => {
        const row = rows[0] || {};
        const totalPurchases = parseInt(row.total_purchases, 10) || 0;
        const firstPurchase = row.first_purchase;
        const lastPurchase = row.last_purchase;
        const uniqueProducts = parseInt(row.unique_products, 10) || 0;
        const mostBoughtItems = row.most_bought_items || [];
        const monthlyPurchases = row.monthly_purchases || [];
        const categoryDistribution = row.category_distribution || [];
        const dayOfWeekStats = row.day_of_week_stats || [];
        const dayOfMonthStats = row.day_of_month_stats || [];
        const productTrends = row.product_trends || [];
        const thisMonthCount = parseInt(row.this_month_count, 10) || 0;
        const lastMonthCount = parseInt(row.last_month_count, 10) || 0;
        const twoMonthsAgoCount = parseInt(row.two_months_ago_count, 10) || 0;
        const dailyPurchases = row.daily_purchases || [];
        const frequencyDistribution = row.frequency_distribution || [];
        const productFrequency = row.product_frequency || [];
        const intervalTrend = row.interval_trend || [];
        const hourOfDay = row.hour_of_day || [];
        const weeklyComparison = row.weekly_comparison || [];
        const seasonalTrends = row.seasonal_trends || [];
        const categoryFrequency = row.category_frequency || [];
        const productLifecycle = row.product_lifecycle || [];
        const purchaseVelocity = row.purchase_velocity || [];
        const intervalsSummary = row.intervals_summary || {};

        // Calculate purchase frequency (items per week/month)
        let itemsPerWeek = 0;
        let itemsPerMonth = 0;

        if (firstPurchase && lastPurchase && totalPurchases > 0) {
          const daysDiff = Math.max(
            1,
            (new Date(lastPurchase) - new Date(firstPurchase)) /
              (1000 * 60 * 60 * 24)
          );
          const weeksDiff = Math.max(1, daysDiff / 7);
          const monthsDiff = Math.max(1, daysDiff / 30);

          itemsPerWeek = Math.round((totalPurchases / weeksDiff) * 10) / 10;
          itemsPerMonth = Math.round((totalPurchases / monthsDiff) * 10) / 10;
        }

        // Find most active day (return day number 0-6, where 0=Sunday, 6=Saturday)
        // Frontend will translate this to the user's language
        let mostActiveDay = null;
        if (dayOfWeekStats.length > 0) {
          const maxDay = dayOfWeekStats.reduce(
            (max, day) => (day.count > max.count ? day : max),
            dayOfWeekStats[0]
          );
          mostActiveDay = maxDay.day; // Return day number instead of name
        }

        const now = new Date();
        const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const twoMonthsAgoDate = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          1
        );

        const formatMonthName = (date) => {
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          return monthNames[date.getMonth()];
        };

        const monthComparison = {
          thisMonth: thisMonthCount,
          lastMonth: lastMonthCount,
          twoMonthsAgo: twoMonthsAgoCount,
          thisMonthName: formatMonthName(thisMonthDate),
          lastMonthName: formatMonthName(lastMonthDate),
          twoMonthsAgoName: formatMonthName(twoMonthsAgoDate),
          change:
            lastMonthCount > 0
              ? Math.round(
                  ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100
                )
              : thisMonthCount > 0
              ? 100
              : 0,
        };

        done(null, {
          totalPurchases,
          uniqueProducts,
          dateRange: {
            first: firstPurchase,
            last: lastPurchase,
          },
          purchaseFrequency: {
            itemsPerWeek,
            itemsPerMonth,
          },
          mostBoughtItems,
          monthlyPurchases,
          categoryDistribution,
          dayOfWeekStats,
          dayOfMonthStats,
          productTrends,
          monthComparison,
          mostActiveDay,
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
        });
      })
      .catch((err) => done({ ...err, stack: err.stack }));
  },
});
