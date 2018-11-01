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

  reorder({ startIndex, endIndex }, done) {
    const begin = 'BEGIN TRANSACTION;';
    const setTemp = `
      UPDATE categories 
      SET orderidx = 0
      WHERE orderidx = ${startIndex};\n`;

    let move = '';
    // MOVE UP
    if (startIndex - endIndex > 0) {
      move = `
        UPDATE categories
        SET orderidx = (orderidx + 1)
        WHERE orderidx > ${endIndex - 1} and orderidx > 0;`;
    }
    // MOVE DOWN
    if (startIndex - endIndex < 0) {
      move = `
        UPDATE categories
        SET orderidx = (orderidx - 1)
        WHERE orderidx <= ${endIndex} and orderidx > 0;`;
    }

    const replaceTemp = `
      UPDATE categories
      SET orderidx = ${endIndex}
      WHERE orderidx = 0;\n`;

    const end = 'END TRANSACTION;';
    const sql = begin + setTemp + move + replaceTemp + end;

    client
      .query(sql)
      .then(() => done(null, null))
      .catch(err => done(err));
  },
});
