const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mysql = require('mysql');

const { databaseUrl, googleAuth } = require('../env');

const connection = mysql.createConnection(databaseUrl);

module.exports = passport => {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM users WHERE id = ? ', [id], (err, rows) => {
      done(err, rows[0]);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleAuth.clientID,
        clientSecret: googleAuth.clientSecret,
        callbackURL: googleAuth.callbackURL,
      },
      (token, refreshToken, profile, done) => {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {
          const email = profile.emails[0].value; // pull the first email

          connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, rows) => {
              if (err) return done(err);
              if (rows.length) {
                // all is well, return successful user
                return done(null, rows[0]);
              }
              // if there is no user with that username
              // create the user
              const newUser = {
                username: profile.displayName,
                email,
              };

              const insertQuery =
                'INSERT INTO users ( username, email ) values (?,?)';

              return connection.query(
                insertQuery,
                [newUser.username, newUser.email],
                (errInsert, rowsInsert) => {
                  if (errInsert) return done(errInsert);
                  newUser.id = rowsInsert.insertId;

                  return done(null, newUser);
                }
              );
            }
          );
        });
      }
    )
  );
};
