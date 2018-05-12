module.exports = client => ({
  getAll(done) {
    done(null, [{ id: 1, name: 'Mejeri' }]);
  },
});
