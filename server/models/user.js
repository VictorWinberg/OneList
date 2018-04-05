const valid = key => ['username', 'email', 'photo', 'language'].includes(key);

const entries = user => {
  const keys = Object.keys(user).filter(valid);
  const values = keys.map(key => user[key]);
  return [keys, values];
};

const insertUser = user => {
  const [keys, values] = entries(user);
  const vals = values.map((v, i) => `$${i + 1}`);

  return [
    `INSERT INTO users ( ${keys} ) VALUES ( ${vals} ) RETURNING *`,
    values,
  ];
};

const updateUserByID = (id, user) => {
  const [keys, values] = entries(user);
  const set = keys.map((key, i) => `${key} = $${i + 1}`);

  return [`UPDATE users SET ${set} WHERE id = ${id} RETURNING *`, values];
};

module.exports = client => ({
  create(newUser, done) {
    const [query, values] = insertUser(newUser);

    client
      .query(query, values)
      .then(({ rows }) => done(null, rows[0] || null))
      .catch(err => done(err));
  },

  update(userId, updatedUser, done) {
    const [query, values] = updateUserByID(userId, updatedUser);

    client
      .query(query, values)
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
