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
        WITH weekly_by_category AS (
          SELECT
            DATE_TRUNC('week', pp.purchased_at) as week_start,
            COALESCE(c.name, c_product.name, 'Uncategorized') as category,
            COUNT(*)::int as count
          FROM product_purchases pp
          LEFT JOIN categories c ON pp.category_id = c.id
          LEFT JOIN products p ON pp.product_id = p.id
          LEFT JOIN categories c_product ON p.category = c_product.id
          WHERE pp.purchased_at >= NOW() - INTERVAL '12 weeks'
          GROUP BY
            DATE_TRUNC('week', pp.purchased_at),
            COALESCE(c.name, c_product.name, 'Uncategorized')
        ),
        recent_weeks AS (
          SELECT DISTINCT week_start
          FROM weekly_by_category
          ORDER BY week_start DESC
          LIMIT 12
        ),
        week_totals AS (
          SELECT wbc.week_start, SUM(wbc.count)::int as total_count
          FROM weekly_by_category wbc
          INNER JOIN recent_weeks rw ON wbc.week_start = rw.week_start
          GROUP BY wbc.week_start
        )
        SELECT
          TO_CHAR(wt.week_start, 'YYYY-MM-DD') as week,
          TO_CHAR(wt.week_start, 'Mon DD') as week_label,
          wt.total_count as count,
          LAG(wt.total_count) OVER (ORDER BY wt.week_start) as previous_count,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object('category', wbc.category, 'count', wbc.count)
                ORDER BY wbc.count DESC
              )
              FROM weekly_by_category wbc
              WHERE wbc.week_start = wt.week_start
            ),
            '[]'
          ) as categories
        FROM week_totals wt
        ORDER BY wt.week_start
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
      ),
      shopping_trip_frequency AS (
        WITH daily_trips AS (
          SELECT DATE(purchased_at) as trip_date
          FROM product_purchases
          GROUP BY DATE(purchased_at)
        )
        SELECT
          TO_CHAR(DATE_TRUNC('week', trip_date), 'YYYY-MM-DD') as week,
          TO_CHAR(DATE_TRUNC('week', trip_date), 'Mon DD') as week_label,
          COUNT(*)::int as trip_count
        FROM daily_trips
        WHERE trip_date >= NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', trip_date)
        ORDER BY DATE_TRUNC('week', trip_date)
      ),
      trip_summary AS (
        SELECT COUNT(DISTINCT DATE(purchased_at))::int as total_trips
        FROM product_purchases
      ),
      shopping_heatmap AS (
        SELECT
          EXTRACT(DOW FROM trip_date)::int as day,
          hour,
          COUNT(*)::int as count
        FROM (
          SELECT
            DATE(purchased_at) as trip_date,
            EXTRACT(HOUR FROM purchased_at)::int as hour
          FROM product_purchases
          WHERE purchased_at >= NOW() - INTERVAL '12 months'
          GROUP BY DATE(purchased_at), EXTRACT(HOUR FROM purchased_at)
        ) trip_hours
        GROUP BY EXTRACT(DOW FROM trip_date), hour
      ),
      category_variety AS (
        SELECT
          COALESCE(c.name, 'Uncategorized') as category,
          TO_CHAR(purchased_at, 'YYYY-MM') as month,
          COUNT(DISTINCT COALESCE(pp.product_id::text, pp.product_name))::int as distinct_products
        FROM product_purchases pp
        LEFT JOIN categories c ON pp.category_id = c.id
        WHERE purchased_at >= NOW() - INTERVAL '6 months'
        GROUP BY COALESCE(c.name, 'Uncategorized'), TO_CHAR(purchased_at, 'YYYY-MM')
        ORDER BY category, month
      ),
      product_adoption AS (
        WITH first_purchases AS (
          SELECT product_id, MIN(purchased_at) as first_purchase_at
          FROM product_purchases
          WHERE product_id IS NOT NULL
          GROUP BY product_id
        )
        SELECT
          COUNT(*) FILTER (WHERE pp.purchased_at = fp.first_purchase_at)::int as first_time_count,
          COUNT(*)::int as total_linked_purchases,
          (SELECT COUNT(*)::int FROM products WHERE created_at >= NOW() - INTERVAL '12 months') as new_products_added,
          (SELECT COUNT(*)::int FROM products) as total_products
        FROM product_purchases pp
        JOIN first_purchases fp ON pp.product_id = fp.product_id
        WHERE pp.product_id IS NOT NULL
          AND pp.purchased_at >= NOW() - INTERVAL '12 months'
      ),
      abandoned_products_all AS (
        SELECT
          p.name,
          p.created_at,
          MAX(pp.purchased_at) as last_purchase
        FROM products p
        LEFT JOIN product_purchases pp ON p.id = pp.product_id
        GROUP BY p.id, p.name, p.created_at
        HAVING MAX(pp.purchased_at) < NOW() - INTERVAL '6 months'
            OR MAX(pp.purchased_at) IS NULL
      ),
      abandoned_products AS (
        SELECT name, created_at, last_purchase
        FROM abandoned_products_all
        ORDER BY last_purchase ASC NULLS FIRST
        LIMIT 15
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
        (SELECT count FROM this_month) as this_month_count,
        (SELECT count FROM last_month) as last_month_count,
        (SELECT count FROM two_months_ago) as two_months_ago_count,
        COALESCE(
          (SELECT json_agg(json_build_object('hour', hour, 'count', count)) FROM hour_of_day),
          '[]'
        ) as hour_of_day,
        COALESCE(
          (SELECT json_agg(json_build_object('week', week, 'weekLabel', week_label, 'count', count, 'previousCount', previous_count, 'categories', categories)) FROM weekly_comparison),
          '[]'
        ) as weekly_comparison,
        COALESCE(
          (SELECT json_agg(json_build_object('year', year, 'month', month, 'yearMonth', year_month, 'count', count)) FROM seasonal_trends),
          '[]'
        ) as seasonal_trends,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'lastPurchase', last_purchase, 'avgDays', avg_days, 'predictedRestockDate', predicted_restock_date, 'status', status, 'purchaseCount', purchase_count, 'highlighted', highlighted)) FROM product_restock_predictions),
          '[]'
        ) as product_restock_predictions,
        COALESCE(
          (SELECT json_agg(json_build_object('week', week, 'weekLabel', week_label, 'tripCount', trip_count)) FROM shopping_trip_frequency),
          '[]'
        ) as shopping_trip_frequency,
        (SELECT total_trips FROM trip_summary) as total_trips,
        COALESCE(
          (SELECT json_agg(json_build_object('day', day, 'hour', hour, 'count', count)) FROM shopping_heatmap),
          '[]'
        ) as shopping_heatmap,
        COALESCE(
          (SELECT json_agg(json_build_object('category', category, 'month', month, 'distinctProducts', distinct_products)) FROM category_variety),
          '[]'
        ) as category_variety,
        COALESCE(
          (SELECT json_build_object('firstTimeCount', first_time_count, 'totalLinkedPurchases', total_linked_purchases, 'newProductsAdded', new_products_added, 'totalProducts', total_products) FROM product_adoption),
          '{"firstTimeCount":0,"totalLinkedPurchases":0,"newProductsAdded":0,"totalProducts":0}'
        ) as product_adoption,
        COALESCE(
          (SELECT json_agg(json_build_object('name', name, 'createdAt', created_at, 'lastPurchase', last_purchase)) FROM abandoned_products),
          '[]'
        ) as abandoned_products,
        (SELECT COUNT(*)::int FROM abandoned_products_all) as abandoned_products_count
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
        const thisMonthCount = parseInt(row.this_month_count, 10) || 0;
        const lastMonthCount = parseInt(row.last_month_count, 10) || 0;
        const twoMonthsAgoCount = parseInt(row.two_months_ago_count, 10) || 0;
        const hourOfDay = row.hour_of_day || [];
        const weeklyComparison = (row.weekly_comparison || []).map((week) => {
          let categories = week.categories;
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

          const count = parseInt(week.count, 10) || 0;
          const normalizedCategories = categories
            .map((entry) => ({
              category: entry.category || 'Uncategorized',
              count: parseInt(entry.count, 10) || 0,
            }))
            .filter((entry) => entry.count > 0);

          return {
            week: week.week,
            weekLabel: week.weekLabel || week.week_label,
            count,
            previousCount:
              week.previousCount != null
                ? parseInt(week.previousCount, 10)
                : week.previous_count != null
                ? parseInt(week.previous_count, 10)
                : null,
            categories:
              normalizedCategories.length > 0
                ? normalizedCategories
                : count > 0
                ? [{ category: 'Uncategorized', count }]
                : [],
          };
        });
        const seasonalTrends = row.seasonal_trends || [];
        const productRestockPredictions = row.product_restock_predictions || [];
        const shoppingTripFrequency = row.shopping_trip_frequency || [];
        const totalTrips = parseInt(row.total_trips, 10) || 0;
        const shoppingHeatmap = row.shopping_heatmap || [];
        const categoryVariety = row.category_variety || [];
        const productAdoption = row.product_adoption || {
          firstTimeCount: 0,
          totalLinkedPurchases: 0,
          newProductsAdded: 0,
          totalProducts: 0,
        };
        const abandonedProducts = row.abandoned_products || [];
        const abandonedProductsCount =
          parseInt(row.abandoned_products_count, 10) || 0;

        // Calculate purchase frequency (items per week/month)
        let itemsPerWeek = 0;
        let itemsPerMonth = 0;
        let tripsPerWeek = 0;
        let tripsPerMonth = 0;

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
          tripsPerWeek = Math.round((totalTrips / weeksDiff) * 10) / 10;
          tripsPerMonth = Math.round((totalTrips / monthsDiff) * 10) / 10;
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
            tripsPerWeek,
            tripsPerMonth,
          },
          totalTrips,
          shoppingTripFrequency,
          shoppingHeatmap,
          categoryVariety,
          productAdoption,
          abandonedProducts,
          abandonedProductsCount,
          mostBoughtItems,
          monthlyPurchases,
          dayOfWeekStats,
          monthComparison,
          mostActiveDay,
          hourOfDay,
          weeklyComparison,
          seasonalTrends,
          productRestockPredictions,
        });
      })
      .catch((err) => done({ ...err, stack: err.stack }));
  },
});
