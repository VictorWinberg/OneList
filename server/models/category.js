module.exports = (client) => ({
  async create({ name }, done) {
    try {
      await client.query('BEGIN');

      const {
        rows: [category],
      } = await client.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [name]
      );

      await client.query(
        `INSERT INTO category_store_order (store_id, category_id, orderidx)
         SELECT s.id, $1, COALESCE(
           (SELECT MAX(orderidx) FROM category_store_order WHERE store_id = s.id), 0
         ) + 1
         FROM stores s`,
        [category.id]
      );

      await client.query('COMMIT');
      done(null, category);
    } catch (error) {
      await client.query('ROLLBACK');
      done(error);
    }
  },

  update(id, { name, color }, done) {
    const sql = 'UPDATE categories SET name = $2, color = $3 WHERE id = $1';
    client
      .query(sql, [id, name, color])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
  },

  delete(id, done) {
    const sql = 'DELETE FROM categories WHERE id = $1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
  },

  getAll(storeId, done) {
    const sql = `
      SELECT c.id, c.name, c.color, cso.orderidx
      FROM categories c
      JOIN category_store_order cso ON cso.category_id = c.id
      WHERE cso.store_id = $1
      ORDER BY cso.orderidx`;
    client
      .query(sql, [storeId])
      .then(({ rows }) => done(null, rows))
      .catch((err) => done(err));
  },

  async reorder({ storeId, startIndex, endIndex }, done) {
    try {
      const store = parseInt(storeId, 10);
      const start = parseInt(startIndex, 10);
      const end = parseInt(endIndex, 10);

      await client.query('BEGIN');

      await client.query(
        `UPDATE category_store_order SET orderidx = 0
         WHERE store_id = $1 AND orderidx = $2`,
        [store, start]
      );

      if (start - end > 0) {
        await client.query(
          `UPDATE category_store_order SET orderidx = orderidx + 1
           WHERE store_id = $1 AND orderidx >= $2 AND orderidx < $3`,
          [store, end, start]
        );
      }

      if (start - end < 0) {
        await client.query(
          `UPDATE category_store_order SET orderidx = orderidx - 1
           WHERE store_id = $1 AND orderidx <= $2 AND orderidx > $3`,
          [store, end, start]
        );
      }

      await client.query(
        `UPDATE category_store_order SET orderidx = $1
         WHERE store_id = $2 AND orderidx = 0`,
        [end, store]
      );

      const {
        rows: [{ unique }],
      } = await client.query(
        `SELECT CASE WHEN
         COUNT(DISTINCT orderidx) = COUNT(orderidx)
         THEN 1 ELSE 0 END AS unique
         FROM category_store_order WHERE store_id = $1`,
        [store]
      );

      if (unique) {
        await client.query('COMMIT');
      } else {
        await client.query('ROLLBACK');
        return done(
          new Error('Reorder operation would create duplicate orderidx values')
        );
      }

      done(null, null);
    } catch (error) {
      await client.query('ROLLBACK');
      done(error);
    }
  },
});
