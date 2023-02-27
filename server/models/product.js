module.exports = client => ({
  create({ name, uid }, done) {
    const sql = `
      WITH product AS (
        INSERT INTO products (name) VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = $1
        RETURNING *
      ), item AS (
        INSERT INTO items (product, uid)
        SELECT id, COALESCE($2, 0) FROM product
        RETURNING *
      )
      SELECT * FROM product
      JOIN item ON (product.id = item.product)`;
    client
      .query(sql, [name, uid])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  update(id, { name, amount, unit, category }, done) {
    const sql = 'UPDATE products SET name = $2, amount = $3, unit = $4, category = $5 WHERE id = $1';
    client
      .query(sql, [id, name, amount, unit, category])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done({ ...err, stack: err.stack }));
  },

  toggleChecked(id, uid, done) {
    const sql = 'UPDATE items SET checked = NOT checked WHERE product = $1 AND uid = $2';
    client
      .query(sql, [id, uid])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done({ ...err, stack: err.stack }));
  },

  toggleInactive(id, uid, done) {
    const sql = `
      DO $$
      BEGIN
      IF EXISTS (SELECT * FROM items WHERE product = ${id} AND uid = ${uid}) THEN
        DELETE FROM items WHERE product = ${id} AND uid = ${uid};
      ELSE
        INSERT INTO items (product, uid) VALUES (${id}, ${uid});
      END IF;
      END $$;
      `;
    client
      .query(sql)
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done({ ...err, stack: err.stack }));
  },

  delete(id, done) {
    const sql = 'DELETE FROM products WHERE id = $1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done({ ...err, stack: err.stack }));
  },

  getAll(done) {
    client
      .query('SELECT * FROM products FULL JOIN items ON (products.id = items.product) ORDER BY name')
      .then(({ rows }) => done(null, rows))
      .catch(err => done({ ...err, stack: err.stack }));
  },

  inactivate(uid, done) {
    const where = `WHERE checked = TRUE AND (uid = 0 OR uid = ${uid})`

    client
      .query(`
        BEGIN;
          UPDATE products SET updated_at = NOW() WHERE id IN (
            SELECT product FROM items ${where}
          );
          DELETE FROM items ${where};
        COMMIT;
      `)
      .then(({ rows }) => done(null, rows))
      .catch(err => done({ ...err, stack: err.stack }));
  },
});
