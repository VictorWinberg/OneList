module.exports = client => ({
  create({ name, category }, done) {
    const sql = `
      INSERT INTO products (name, category) VALUES ($1, $2)
      ON CONFLICT (name) DO UPDATE SET inactive = FALSE, checked = FALSE
      RETURNING *`;
    client
      .query(sql, [name, category])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  update(id, { name, amount, unit, category }, done) {
    const sql = 'UPDATE products SET name = $2, amount = $3, unit = $4, category = $5 WHERE id = $1';
    client
      .query(sql, [id, name, amount, unit, category])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  toggleChecked(id, done) {
    const sql = 'UPDATE products SET checked = NOT checked WHERE id = $1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  toggleInactive(id, done) {
    const sql = 'UPDATE products SET inactive = NOT inactive WHERE id = $1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  delete(id, done) {
    const sql = 'DELETE FROM products WHERE id = $1';
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

  inactivate(done) {
    client
      .query('UPDATE products SET inactive = TRUE WHERE checked = TRUE')
      .then(({ rows }) => done(null, rows))
      .catch(err => done(err));
  },
});
