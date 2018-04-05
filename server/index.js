const express = require('express');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const { Client } = require('pg');
const passport = require('passport');

const app = express();
const port = 3004;
const { databaseUrl } = require('../env');

// serve static react build
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// connect to our database
const client = new Client(databaseUrl);
client.connect();

const User = require('./models/user')(client);
require('./passport')(passport, User);

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// required for passport
const { sessionSecrets } = require('../env');

app.use(
  session({
    name: 'session',
    keys: sessionSecrets,
    // Cookie Options
    httpOnly: true,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    maxAge: 30 * 24 * 60 * 60 * 1000, // one month
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes
require('./routes.js')(app, passport, User);

app.listen(port, () => console.log('ShoppingList app listening on port 3004!'));
