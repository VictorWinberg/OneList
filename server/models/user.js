module.exports = client => ({
  create(newUser, done) {
    const values = Object.keys(newUser).map(key => newUser[key]);

    client
      .query(
        'INSERT INTO users ( email, username, photo, language ) values ($1, $2, $3, $4) RETURNING *',
        values
      )
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  update(updatedUser, userId, done) {
    const values = Object.keys(updatedUser).map(key => updatedUser[key]);

    client
      .query(
        'UPDATE users SET email = $1, username = $2, photo = $3, language = $4 WHERE id = $5 RETURNING *',
        values.concat[userId]
      )
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  getAll(done) {
    client
      .query('SELECT * FROM users')
      .then(({ rows }) => done(null, rows))
      .catch(err => done(err));
  },

  getById(userId, done) {
    client
      .query('SELECT * FROM users WHERE id = $1', [userId])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  getByEmail(email, done) {
    client
      .query('SELECT * FROM users WHERE email = $1', [email])
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },
});
