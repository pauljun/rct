const rollup = require('rollup');
const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const strip = require('rollup-plugin-strip');
const { uglify } = require('rollup-plugin-uglify');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const json = require('rollup-plugin-json');
const sass = require('rollup-plugin-sass');
const moduleConfig = require('../config/module.config');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const image = require('rollup-plugin-image');
const url = require('postcss-url');

const extensions = ['.js', '.jsx'];

const args = process.argv.slice(2);

const moduleNames = args.filter(name => !/^--/.test(name));

const params = {};
args
  .filter(name => /^--/.test(name))
  .map(name => {
    let arr = name.split('=');
    params[arr[0]] = arr[1] || true;
  });

const getBabelOptions = () => ({
  presets: ['@babel/react', '@babel/flow', ['@babel/env', { loose: true }]],
  exclude: path.resolve(process.cwd(), 'node_modules/**'),
  runtimeHelpers: true,
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/transform-runtime', { corejs: 2, useESModules: true }],
    ['@babel/plugin-external-helpers']
  ]
});

const snapshotArgs =
  process.env.SNAPSHOT === 'match'
    ? {
        matchSnapshot: true,
        threshold: 1000
      }
    : {};

const commonjsArgs = {
  include: 'node_modules/**',
  // needed for react-is via react-redux v5.1
  // https://stackoverflow.com/questions/50080893/rollup-error-isvalidelementtype-is-not-exported-by-node-modules-react-is-inde/50098540
  namedExports: {
    'node_modules/react-is/index.js': ['isValidElementType']
  }
};

const external = [
  'react',
  'react-dom',
  'react-router-dom',
  'mobx',
  'mobx-react',
  'antd',
  'js-cookie',
  'lodash'
];

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

function getSassOptions() {
  return {
    insert: true,
    processor: (code, id) =>
      postcss([autoprefixer], { from: id })
        .process(code)
        .then(result => result.css)
  };
}

function getInputOptions(input) {
  let plugins = [
    json(),
    image(),
    sass(getSassOptions()),
    resolve({ extensions, browser: true, preferBuiltins: false }),
    commonjs(commonjsArgs),
    babel(getBabelOptions()),
    strip({ debugger: true }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    sizeSnapshot(snapshotArgs)
  ];
  if (params.uglify !== false) {
    plugins.push(uglify());
  }
  return {
    input,
    external,
    plugins
  };
}

function getOutputOptions(output, name) {
  const formats = ['amd', 'cjs', 'es', 'iife', 'umd'];
  return {
    file: path.resolve(process.cwd(), `public${output}`),
    format: formats.indexOf(params.format) > -1 ? params.format : 'umd',
    name,
    sourcemap: params.sourcemap !== false
  };
}

async function build() {
  if (moduleNames.length === 0) {
    return;
  }
  moduleNames.forEach(async name => {
    const config = moduleConfig[name];
    if (config) {
      const bundle = await rollup.rollup(getInputOptions(config.input));
      await bundle.write(getOutputOptions(config.output, name));
    } else {
      console.error(
        `module '${name}' is not config ,please check config/module.config.js!`
      );
    }
  });
  // create a bundle

  // or write the bundle to disk
}

build();
