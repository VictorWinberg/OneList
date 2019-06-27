const proxy = require('http-proxy-middleware');

module.exports = app => {
  app.use(proxy('/__', { target: 'http://localhost:3004/' }));
};
