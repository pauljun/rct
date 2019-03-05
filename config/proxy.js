const proxyMiddleware = require('http-proxy-middleware');

const proxyConfig = {
  '/api': {
    target: 'http://127.0.0.1:8892'
  },
  '/staticResource': {
    target: 'http://127.0.0.1:8892'
  },
  '/vidimg': {
    target: 'http://127.0.0.1:8892'
  }
};

module.exports = function(app) {
  Object.keys(proxyConfig).map(key => {
    app.use(proxyMiddleware(key, proxyConfig[key]));
  });
};
