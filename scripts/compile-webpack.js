'use strict';

console.log();
console.log('Start Building...');
console.log();

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const chalk = require('chalk');
const webpack = require('webpack');
const getCompileConfig = require('../config/webpack.config.compile');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const moduleConfig = require('../config/module.config');
const assetManifest = require('../public/asset-manifest.json');
const utils = require('./utils');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);

let moduleNames = argv.filter(name => !/^--/.test(name));

const params = {};
argv
  .filter(name => /^--/.test(name))
  .map(name => {
    let arr = name.split('=');
    params[arr[0]] = arr[1] || true;
  });

let manifest = {};

utils.event.on('manifest', json => {
  manifest = Object.assign({}, json, manifest);
});

init();

function init() {
  if (moduleNames.length === 0) {
    return;
  }
  if (moduleNames.length === 1 && moduleNames[0] === 'all') {
    moduleNames = Object.keys(moduleConfig).filter(
      v => !!moduleConfig[v].input
    );
  }
  if (moduleNames.length === 1 && moduleNames[0] === 'page') {
    moduleNames = Object.keys(moduleConfig).filter(
      v => moduleConfig[v].isPage && !!moduleConfig[v].input
    );
  }
  if (moduleNames.length === 1 && moduleNames[0] === 'dep') {
    moduleNames = Object.keys(moduleConfig).filter(v => moduleConfig[v].isDep);
  }
  if (moduleNames.length === 1 && moduleNames[0] === 'lib') {
    moduleNames = Object.keys(moduleConfig).filter(v => moduleConfig[v].isLib);
  }

  //此配置不提供给第3放使用
  if (moduleNames.length === 1 && moduleNames[0] === 'baseComponent') {
    moduleNames = Object.keys(moduleConfig).filter(
      v => !!moduleConfig[v].isBaseComponent
    );
  }
  //此配置不提供给第3放使用
  if (moduleNames.length === 1 && moduleNames[0] === 'businessComponent') {
    moduleNames = Object.keys(moduleConfig).filter(
      v => !!moduleConfig[v].isBusinessComponent
    );
  }

  let arr = moduleNames.map(name =>
    build(name).then(({ stats, name, warnings, code }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      }
      code === 200 &&
        console.log(chalk.green(`module[${name}] Compiled successfully.\n`));
    })
  );
  Promise.all(arr)
    .then(() => {
      const asstes = Object.assign({}, assetManifest, manifest);
      utils.writeFile(
        paths.resolveApp('public/asset-manifest.json'),
        JSON.stringify(asstes, null, 2)
      );
    })
    .catch(err => {
      if (err && err.message) {
        console.log(chalk.red(err.message));
        console.log();
        throw err;
      }
      process.exit(1);
    });
}

function build(name) {
  if (!moduleConfig[name]) {
    return Promise.reject({
      message: `module[${name}] is not defined , please check config/module.config.js`
    });
  }
  if (!moduleConfig[name].input) {
    return Promise.resolve({
      code: 404,
      warnings: [
        `module[${name}][input] is not defined,`,
        `If you are sure that it is a package that needs to be compiled,`,
        `please check module[${name}][input] in config/module.config.js;`
      ]
    });
  }

  let config = {};
  config.entry = {
    [name]: moduleConfig[name].input
  };
  config.name = name;
  config.path = paths.appPublic;
  config.output = moduleConfig[name].output.replace(/^\//, '');
  config.globalName = moduleConfig[name].globalName;
  console.log(
    chalk.yellow(
      `building module[${name}] entry -> ${
        moduleConfig[name].input
      }, output -> /public${moduleConfig[name].output}`
    )
  );
  console.log();

  let compiler = webpack(getCompileConfig(config));
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: []
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        name,
        warnings: messages.warnings,
        code: 200
      };

      return resolve(resolveArgs);
    });
  });
}
