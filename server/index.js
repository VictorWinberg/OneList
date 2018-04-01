const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const passport = require('passport');

const app = express();
const port = 3004;

// serve static react build
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// connect to our database
require('./passport')(passport);

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// required for passport
const { sessionSecret } = require('../env');

app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes
require('./routes.js')(app, passport);

app.listen(port, () => console.log('ShoppingList app listening on port 3004!'));
