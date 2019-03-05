const paths = require('../config/paths');
const utils = require('./utils');
const config = require('../config/base.module.config')

/**
 * 提供第三方的release版本使用
 */
async function readConfig() {
  Object.keys(config).map(k => {
    if(config[k].input){
      delete config[k].input
    }
  })
  utils.writeFile(
    paths.resolveApp('custom.module.config.js'),
    `module.exports = ${JSON.stringify(config, null, 2)}`
  ).then(() => {
    console.log('create file success in custom.module.config.js')
  });
}

readConfig();
