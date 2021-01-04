const path = require('path');

module.exports = (app, passport, db) => {
  // route middleware to make sure
  const isLoggedIn = (req, res, next) => {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    return res.sendStatus(401);
  };

  const callback = req => {
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    return `${protocol}://${host}/__/auth/google/callback`;
  };

  app.get('/__/auth/google', (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      callbackURL: callback(req),
    })(req, res, next);
  });

  // the callback after google has authenticated the user
  app.get('/__/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', {
      successRedirect: '/',
      callbackURL: callback(req),
    })(req, res, next);
  });

  app.get('/__/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.clearCookie('connect.sid');
    res.redirect('/');
  });

  app.get('/__/user', (req, res) => {
    res.send(req.user || {});
  });

  app.put('/__/user', isLoggedIn, (req, res) => {
    db.User.update(req.user.id, req.body, (err, user) => {
      if (err) return res.status(400).send(err);
      return res.send(user);
    });
  });

  app.get('/__/products', isLoggedIn, (req, res) => {
    db.Product.getAll((err, products) => {
      if (err) return res.status(400).send(err);
      return res.send(products);
    });
  });

  app.post('/__/products', isLoggedIn, (req, res) => {
    db.Product.create(req.body, (err, product) => {
      if (err) return res.status(400).send(err);
      return res.send(product);
    });
  });

  app.put('/__/products', isLoggedIn, (req, res) => {
    db.Product.inactivate((err, products) => {
      if (err) return res.status(400).send(err);
      return res.send(products);
    });
  });

  app.put('/__/products/:id', isLoggedIn, (req, res) => {
    db.Product.update(req.params.id, req.body, (err, product) => {
      if (err) return res.status(400).send(err);
      return res.send(product);
    });
  });

  app.put('/__/products/:id/:uid', isLoggedIn, (req, res) => {
    const result = (err, product) => {
      if (err) return res.status(400).send(err);
      return res.send(product);
    };

    if (req.get('Type') === 'toggle-checked') {
      db.Product.toggleChecked(req.params.id, req.params.uid, result);
    } else if (req.get('Type') === 'toggle-inactive') {
      db.Product.toggleInactive(req.params.id, req.params.uid, result);
    } else {
      res.sendStatus(400);
    }
  });

  app.delete('/__/products/:id', isLoggedIn, (req, res) => {
    db.Product.delete(req.params.id, (err, product) => {
      if (err) return res.status(400).send(err);
      return res.send(product);
    });
  });

  app.get('/__/categories', isLoggedIn, (req, res) => {
    db.Category.getAll((err, categories) => {
      if (err) return res.status(400).send(err);
      return res.send(categories);
    });
  });

  app.post('/__/categories', isLoggedIn, (req, res) => {
    db.Category.create(req.body, (err, category) => {
      if (err) return res.status(400).send(err);
      return res.send(category);
    });
  });

  app.put('/__/categories/:id', isLoggedIn, (req, res) => {
    db.Category.update(req.params.id, req.body, (err, category) => {
      if (err) return res.status(400).send(err);
      return res.send(category);
    });
  });

  app.delete('/__/categories/:id', isLoggedIn, (req, res) => {
    db.Category.delete(req.params.id, (err, category) => {
      if (err) return res.status(400).send(err);
      return res.send(category);
    });
  });

  app.put('/__/categories_reorder', isLoggedIn, (req, res) => {
    db.Category.reorder(req.body, (err, categories) => {
      if (err) return res.status(400).send(err);
      return res.send(categories);
    });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
};
