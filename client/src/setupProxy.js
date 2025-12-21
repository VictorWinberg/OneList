const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(createProxyMiddleware('/__', { target: 'http://localhost:3000/' }));
};
