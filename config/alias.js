const paths = require('./paths');

module.exports = {
  src: paths.appSrc,
  loader: paths.resolveApp('src/loader.js'),
  decorator: paths.resolveApp('src/decorator/index.js')
};
