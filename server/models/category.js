module.exports = client => ({
  getAll(done) {
    client
      .query('SELECT * FROM categories')
      .then(({ rows }) => done(null, rows))
      .catch(err => done(err));
  },
});
