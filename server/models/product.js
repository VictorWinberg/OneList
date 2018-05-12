module.exports = client => ({
  create({ name, category }, done) {
    const sql =
      'INSERT INTO products (name, category) VALUES ($1, $2) RETURNING *';
    client
      .query(sql, [name, category])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  update(id, { name, category }, done) {
    const sql = 'UPDATE products SET name=$2, category=$3 WHERE id=$1';
    client
      .query(sql, [id, name, category])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  delete(id, done) {
    const sql = 'DELETE FROM products WHERE id=$1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  getAll(done) {
    client
      .query('SELECT * FROM products')
      .then(({ rows }) => done(null, rows))
      .catch(err => done(err));
  },
});
