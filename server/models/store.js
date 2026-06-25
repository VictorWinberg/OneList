module.exports = (client) => ({
  getAll(done) {
    client
      .query('SELECT * FROM stores ORDER BY id')
      .then(({ rows }) => done(null, rows))
      .catch((err) => done(err));
  },

  async create({ name }, done) {
    try {
      await client.query('BEGIN');

      const {
        rows: [store],
      } = await client.query(
        'INSERT INTO stores (name) VALUES ($1) RETURNING *',
        [name]
      );

      await client.query(
        `INSERT INTO category_store_order (store_id, category_id, orderidx)
         SELECT $1, id, ROW_NUMBER() OVER (ORDER BY id)
         FROM categories`,
        [store.id]
      );

      await client.query('COMMIT');
      done(null, store);
    } catch (error) {
      await client.query('ROLLBACK');
      done(error);
    }
  },
});
