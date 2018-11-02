module.exports = client => ({
  create({ name }, done) {
    const sql = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    client
      .query(sql, [name])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  update(id, { name, color }, done) {
    const sql = 'UPDATE categories SET name = $2, color = $3 WHERE id = $1';
    client
      .query(sql, [id, name, color])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  delete(id, done) {
    const sql = 'DELETE FROM categories WHERE id = $1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  getAll(done) {
    client
      .query('SELECT * FROM categories')
      .then(({ rows }) => done(null, rows))
      .catch(err => done(err));
  },

  async reorder({ startIndex, endIndex }, done) {
    try {
      await client.query('BEGIN');

      await client.query(`
        UPDATE categories
        SET orderidx = 0
        WHERE orderidx = ${startIndex};\n`);

      // MOVE UP
      if (startIndex - endIndex > 0) {
        await client.query(`
        UPDATE categories
        SET orderidx = (orderidx + 1)
        WHERE orderidx >= ${endIndex} AND orderidx < ${startIndex};\n`);
      }
      // MOVE DOWN
      if (startIndex - endIndex < 0) {
        await client.query(`
        UPDATE categories
        SET orderidx = (orderidx - 1)
        WHERE orderidx <= ${endIndex} AND orderidx > ${startIndex};\n`);
      }

      await client.query(`
        UPDATE categories
        SET orderidx = ${endIndex}
        WHERE orderidx = 0;\n`);

      const { rows: [{ unique }] } = await client.query(`
        SELECT CASE WHEN
        COUNT(DISTINCT orderidx) = COUNT(orderidx)
        THEN 1 ELSE 0 END AS unique
        FROM categories;`);

      if (unique) {
        await client.query('COMMIT');
      } else {
        await client.query('ROLLBACK');
      }
    } catch (error) {
      await client.query('ROLLBACK');
    } finally {
      done(null, null);
    }
  },
});
