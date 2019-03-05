/**
 * input webpack entry
 * output systemJS import cnd url //编译目录在 /public/static/js/[name].js
 *
 */

const baseModuleConfig = require('./base.module.config');

module.exports = Object.assign({}, baseModuleConfig, {
  //框架层自定义模块

});
