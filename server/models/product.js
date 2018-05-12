module.exports = client => ({
  getAll(done) {
    client
      .query('SELECT * FROM products')
      .then(({ rows }) => done(null, rows))
      .catch(err => done(err));
  },
});
