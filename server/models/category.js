module.exports = (client) => ({
  create({ name }, done) {
    const sql = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    client
      .query(sql, [name])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
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

  getAll(done) {
    client
      .query('SELECT * FROM categories')
      .then(({ rows }) => done(null, rows))
      .catch((err) => done(err));
  },

  async reorder({ startIndex, endIndex }, done) {
    try {
      const start = parseInt(startIndex, 10);
      const end = parseInt(endIndex, 10);

      await client.query('BEGIN');

      await client.query(
        `UPDATE categories SET orderidx = 0 WHERE orderidx = $1`,
        [start]
      );

      // MOVE UP
      if (start - end > 0) {
        await client.query(
          `UPDATE categories SET orderidx = (orderidx + 1) WHERE orderidx >= $1 AND orderidx < $2`,
          [end, start]
        );
      }
      // MOVE DOWN
      if (start - end < 0) {
        await client.query(
          `UPDATE categories SET orderidx = (orderidx - 1) WHERE orderidx <= $1 AND orderidx > $2`,
          [end, start]
        );
      }

      await client.query(
        `UPDATE categories SET orderidx = $1 WHERE orderidx = 0`,
        [end]
      );

      const {
        rows: [{ unique }],
      } = await client.query(`
        SELECT CASE WHEN
        COUNT(DISTINCT orderidx) = COUNT(orderidx)
        THEN 1 ELSE 0 END AS unique
        FROM categories;`);

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
