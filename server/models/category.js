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
});
