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
      product_restock_predictions AS (
        WITH product_last_purchase AS (
          SELECT
            product_name,
            MAX(DATE(purchased_at)) as last_purchase_date,
            COUNT(*) as total_purchases
          FROM product_purchases
          WHERE purchased_at >= NOW() - INTERVAL '12 months'
          GROUP BY product_name
          HAVING COUNT(*) >= 3
        ),
        product_intervals AS (
          SELECT
            pp.product_name,
            DATE(pp.purchased_at) as purchase_date,
            DATE(pp.purchased_at) - LAG(DATE(pp.purchased_at)) OVER (PARTITION BY pp.product_name ORDER BY DATE(pp.purchased_at)) as days_between
          FROM product_purchases pp
          WHERE pp.purchased_at >= NOW() - INTERVAL '12 months'
        ),
        product_interval_stats AS (
          SELECT
            product_name,
            AVG(days_between)::int as avg_days,
            COUNT(*) as interval_count,
            STDDEV(days_between) / NULLIF(AVG(days_between), 0) as interval_cv
          FROM product_intervals
          WHERE days_between IS NOT NULL AND days_between > 0
          GROUP BY product_name
          HAVING COUNT(*) >= 2
        ),
        product_restock_candidates AS (
          SELECT
            plp.product_name as name,
            plp.last_purchase_date as last_purchase,
            pis.avg_days,
            plp.total_purchases as purchase_count,
            (plp.last_purchase_date + pis.avg_days)::date as predicted_restock_date,
            CASE
              WHEN pis.interval_cv <= 0.35 THEN false
              WHEN plp.total_purchases >= 6 AND pis.avg_days <= 21 THEN true
              ELSE NULL
            END as highlighted
          FROM product_last_purchase plp
          JOIN product_interval_stats pis ON plp.product_name = pis.product_name
        )
        SELECT
          name,
          last_purchase,
          avg_days,
          predicted_restock_date,
          CASE
            WHEN predicted_restock_date < NOW()::date THEN 'overdue'
            WHEN predicted_restock_date <= (NOW()::date + INTERVAL '3 days') THEN 'soon'
            ELSE 'upcoming'
          END as status,
          purchase_count,
          highlighted
        FROM product_restock_candidates
        WHERE highlighted IS NOT NULL
          AND predicted_restock_date >= (NOW()::date - INTERVAL '30 days')
          AND predicted_restock_date <= (NOW()::date + INTERVAL '30 days')
        ORDER BY highlighted DESC, predicted_restock_date ASC
        LIMIT 20
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
          (SELECT json_agg(json_build_object('day', day_num, 'name', TRIM(day_name), 'count', count)) FROM day_of_week),
          '[]'
        ) as day_of_week_stats,
        COALESCE(
          (SELECT json_agg(json_build_object('day', day, 'count', count)) FROM day_of_month),
          '[]'
        ) as day_of_month_stats,
        (SELECT count FROM this_month) as this_month_count,
        (SELECT count FROM last_month) as last_month_count,
        (SELECT count FROM two_months_ago) as two_months_ago_count,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'avgDays', avg_days, 'count', count)) FROM product_frequency),
          '[]'
        ) as product_frequency,
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
          (SELECT json_agg(json_build_object('date', date, 'dailyCount', daily_count, 'movingAvg7d', moving_avg_7d)) FROM purchase_velocity),
          '[]'
        ) as purchase_velocity,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'lastPurchase', last_purchase, 'avgDays', avg_days, 'predictedRestockDate', predicted_restock_date, 'status', status, 'purchaseCount', purchase_count, 'highlighted', highlighted)) FROM product_restock_predictions),
          '[]'
        ) as product_restock_predictions
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
        const dayOfWeekStats = row.day_of_week_stats || [];
        const dayOfMonthStats = row.day_of_month_stats || [];
        const thisMonthCount = parseInt(row.this_month_count, 10) || 0;
        const lastMonthCount = parseInt(row.last_month_count, 10) || 0;
        const twoMonthsAgoCount = parseInt(row.two_months_ago_count, 10) || 0;
        const productFrequency = row.product_frequency || [];
        const hourOfDay = row.hour_of_day || [];
        const weeklyComparison = row.weekly_comparison || [];
        const seasonalTrends = row.seasonal_trends || [];
        const purchaseVelocity = row.purchase_velocity || [];
        const productRestockPredictions = row.product_restock_predictions || [];

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
          dayOfWeekStats,
          dayOfMonthStats,
          monthComparison,
          mostActiveDay,
          productFrequency,
          hourOfDay,
          weeklyComparison,
          seasonalTrends,
          purchaseVelocity,
          productRestockPredictions,
        });
      })
      .catch((err) => done({ ...err, stack: err.stack }));
  },
});
