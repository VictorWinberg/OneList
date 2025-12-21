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
        ) as daily_purchases
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

        // Find most active day
        let mostActiveDay = null;
        if (dayOfWeekStats.length > 0) {
          const maxDay = dayOfWeekStats.reduce(
            (max, day) => (day.count > max.count ? day : max),
            dayOfWeekStats[0]
          );
          mostActiveDay = maxDay.name;
        }

        // Calculate month comparison with month names
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
        });
      })
      .catch((err) => done({ ...err, stack: err.stack }));
  },
});
