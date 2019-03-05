const crypto = require('crypto');
const utils = require('./utils');
const paths = require('../config/paths');
const assetsConfig = require('../build/asset-manifest.json');
const packageJson = require('../package.json');

function createHash(asset) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(asset), 'utf8')
    .digest('hex');
}

const HASH_VERSION = createHash({
  VERSION: `${packageJson.name}v${packageJson.version}`
});

function getPrecacheConfig(source) {
  const str = source.trim().replace(/[\s|\n]/g, '');
  const reg = new RegExp(/self\.__precacheManifest\=(\S+)?/);
  return str.match(reg)[1];
}

function getPrecacheResult(source) {
  return `self.__precacheManifest=${JSON.stringify(source, null, 2)}`;
}

utils.readdir(paths.resolveApp('build')).then(async res => {
  const precacheName = res.find(v => v.indexOf('precache-manifest') > -1);
  const precacheAssets = await utils.readFile(
    paths.resolveApp(`build/${precacheName}`)
  );
  const result = eval(getPrecacheConfig(precacheAssets));
  const keyses = Object.keys(assetsConfig);
  for (let k in keyses) {
    const key = keyses[k];
    let has = result.find(v => v.url === assetsConfig[key]);
    if (
      !has &&
      !/.map$/.test(assetsConfig[key]) &&
      assetsConfig[key].indexOf('precache-manifest') === -1
    ) {
      result.push({ revision: HASH_VERSION, url: assetsConfig[key] });
    }
  }
  await utils.writeFile(
    paths.resolveApp(`build/${precacheName}`),
    getPrecacheResult(result)
  );

  console.log(`success -> build/${precacheName}`);
});
