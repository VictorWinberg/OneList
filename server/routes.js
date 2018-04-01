const path = require('path');

module.exports = (app, passport) => {
  // route middleware to make sure
  const isLoggedIn = (req, res, next) => {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    return res.redirect('/');
  };

  app.get('/user', (req, res) => {
    res.send(req.user || {});
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // the callback after google has authenticated the user
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/',
    })
  );

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
};
