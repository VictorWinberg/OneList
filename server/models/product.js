module.exports = (client, ShoppingHistory) => ({
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
      .catch((err) => done(err));
  },

  update(id, { name, amount, unit, category }, done) {
    const sql =
      'UPDATE products SET name = $2, amount = $3, unit = $4, category = $5 WHERE id = $1';
    client
      .query(sql, [id, name, amount, unit, category])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
  },

  toggleChecked(id, uid, done) {
    const sql =
      'UPDATE items SET checked = NOT checked WHERE product = $1 AND uid = $2';
    client
      .query(sql, [id, uid])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
  },

  toggleInactive(id, uid, done) {
    const sql = `
      DO $$
      BEGIN
      IF EXISTS (SELECT * FROM items WHERE product = $1 AND uid = $2) THEN
        DELETE FROM items WHERE product = $1 AND uid = $2;
      ELSE
        INSERT INTO items (product, uid) VALUES ($1, $2);
      END IF;
      END $$;
      `;
    client
      .query(sql, [id, uid])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
  },

  delete(id, done) {
    const sql = 'DELETE FROM products WHERE id = $1';
    client
      .query(sql, [id])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch((err) => done(err));
  },

  getAll(done) {
    client
      .query(
        'SELECT * FROM products FULL JOIN items ON (products.id = items.product) ORDER BY name'
      )
      .then(({ rows }) => done(null, rows))
      .catch((err) => done(err));
  },

  inactivate(uid, done) {
    let checkedItems = [];

    client
      .query('BEGIN')
      .then(() =>
        // First, get the checked items with product details before deletion
        client.query(
          `SELECT p.id as product_id, p.name as product_name, p.category as category_id
           FROM items i
           JOIN products p ON p.id = i.product
           WHERE i.checked = TRUE AND (i.uid = 0 OR i.uid = $1)`,
          [uid]
        )
      )
      .then(({ rows }) => {
        checkedItems = rows;
        return client.query(
          `UPDATE products SET updated_at = NOW() WHERE id IN (
            SELECT product FROM items WHERE checked = TRUE AND (uid = 0 OR uid = $1)
          )`,
          [uid]
        );
      })
      .then(() =>
        client.query(
          'DELETE FROM items WHERE checked = TRUE AND (uid = 0 OR uid = $1)',
          [uid]
        )
      )
      .then(() => {
        // Record purchases if there are checked items
        if (checkedItems.length > 0) {
          return new Promise((resolve, reject) => {
            ShoppingHistory.recordPurchases(uid, checkedItems, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
        return Promise.resolve();
      })
      .then(() => client.query('COMMIT'))
      .then(() => done(null, null))
      .catch((err) => {
        client.query('ROLLBACK').catch(() => {});
        done(err);
      });
  },
});
