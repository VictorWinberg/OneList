const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { Client } = require('pg');

const { databaseUrl, googleAuth } = require('../env');

const client = new Client(databaseUrl);
client.connect();

const get = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

module.exports = passport => {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    client.query('SELECT * FROM users WHERE id = $1', [id], (err, { rows }) => {
      done(err, rows[0]);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleAuth.clientID,
        clientSecret: googleAuth.clientSecret,
      },
      (token, refreshToken, profile, done) => {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {
          const email = get(['emails', 0, 'value'], profile); // pull the first email

          client
            .query('SELECT * FROM users WHERE email = $1', [email])
            .then(({ rows }) => {
              if (rows.length) {
                // all is well, return successful user
                return done(null, rows[0]);
              }
              // if there is no user with that username
              // create the user
              const newUser = {
                email,
                username: get(['displayName'], profile),
                photo: get(['photos', 0, 'value'], profile),
                language: get(['_json', 'language'], profile),
              };

              return client
                .query(
                  'INSERT INTO users ( email, username, photo, language ) values ($1, $2, $3, $4) RETURNING *',
                  Object.keys(newUser).map(key => newUser[key])
                )
                .then(res => {
                  newUser.id = res.rows[0].id;

                  return done(null, newUser);
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        });
      }
    )
  );
};
