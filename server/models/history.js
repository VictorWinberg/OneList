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
      product_restock_predictions AS (
        WITH product_last_purchase AS (
          SELECT
            product_name,
            MAX(DATE(purchased_at)) as last_purchase_date,
            COUNT(*) as total_purchases
          FROM product_purchases
          WHERE purchased_at >= NOW() - INTERVAL '12 months'
          GROUP BY product_name
          HAVING COUNT(*) >= 2
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
          HAVING COUNT(*) >= 1
        ),
        product_restock_candidates AS (
          SELECT
            plp.product_name as name,
            plp.last_purchase_date as last_purchase,
            pis.avg_days,
            pis.interval_cv,
            pis.interval_count,
            plp.total_purchases as purchase_count,
            (plp.last_purchase_date + pis.avg_days)::date as predicted_restock_date,
            CASE
              WHEN plp.total_purchases >= 4 AND pis.avg_days <= 21 THEN true
              ELSE false
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
          highlighted,
          interval_cv,
          CASE
            WHEN predicted_restock_date < NOW()::date
              AND (NOW()::date - predicted_restock_date)
                > GREATEST(21, (avg_days * 1.5)::int)
            THEN 1
            ELSE 0
          END as stale_rank
        FROM product_restock_candidates
        WHERE predicted_restock_date >= (NOW()::date - INTERVAL '90 days')
          AND predicted_restock_date <= (NOW()::date + INTERVAL '45 days')
          AND purchase_count >= 3
          AND interval_count >= 2
          AND NOT (avg_days >= 50 AND purchase_count < 5)
          AND NOT (
            purchase_count < 5
            AND avg_days >= 45
            AND predicted_restock_date > (
              NOW()::date + GREATEST(14, (avg_days * 0.4)::int)
            )
          )
        ORDER BY
          highlighted DESC,
          stale_rank ASC,
          predicted_restock_date ASC,
          COALESCE(interval_cv, 1) ASC,
          purchase_count DESC
        LIMIT 30
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
      abandoned_products_all AS (
        SELECT
          p.id,
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
        SELECT id, name, created_at, last_purchase
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
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'name', name,
                'lastPurchase', last_purchase,
                'avgDays', avg_days,
                'predictedRestockDate', predicted_restock_date,
                'status', status,
                'purchaseCount', purchase_count,
                'highlighted', highlighted
              )
              ORDER BY
                highlighted DESC,
                stale_rank ASC,
                predicted_restock_date ASC,
                COALESCE(interval_cv, 1) ASC,
                purchase_count DESC
            )
            FROM product_restock_predictions
          ),
          '[]'
        ) as product_restock_predictions,
        (SELECT total_trips FROM trip_summary) as total_trips,
        COALESCE(
          (SELECT json_agg(json_build_object('day', day, 'hour', hour, 'count', count)) FROM shopping_heatmap),
          '[]'
        ) as shopping_heatmap,
        COALESCE(
          (SELECT json_agg(json_build_object('id', id, 'name', name, 'createdAt', created_at, 'lastPurchase', last_purchase)) FROM abandoned_products),
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
        const productRestockPredictions = row.product_restock_predictions || [];
        const totalTrips = parseInt(row.total_trips, 10) || 0;
        const shoppingHeatmap = row.shopping_heatmap || [];
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
          shoppingHeatmap,
          abandonedProducts,
          abandonedProductsCount,
          mostBoughtItems,
          monthlyPurchases,
          dayOfWeekStats,
          mostActiveDay,
          productRestockPredictions,
        });
      })
      .catch((err) => done({ ...err, stack: err.stack }));
  },
});
