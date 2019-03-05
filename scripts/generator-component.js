const paths = require('../config/paths');
const utils = require('./utils');

const readArr = [
  utils.readdir(paths.resolveApp('src/components')),
  utils.readdir(paths.resolveApp('src/businessComponents'))
];

async function readConfig() {
  let result = await Promise.all(readArr);
  let json = { baseComponent: {}, businessComponent: {} };
  result[0].forEach(dir => {
    json.baseComponent[dir] = {
      input: `src/components/${dir}/index.js`,
      output: `/static/js/baseComponent/${dir}.js`,
      isBaseComponent: true
    };
  });
  result[1].forEach(dir => {
    json.businessComponent[dir] = {
      input: `src/businessComponents/${dir}/index.js`,
      output: `/static/js/businessComponents/${dir}.js`,
      isBusinessComponent: true
    };
  });
  utils.writeFile(
    paths.resolveApp('config/components.config.js'),
    `module.exports = ${JSON.stringify(json, null, 2)}`
  ).then(() => {
    console.log('create file success in config/component.config.js')
  });
}

readConfig();
