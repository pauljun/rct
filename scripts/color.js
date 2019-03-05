// const paths = require('../config/paths');
const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
  // antDir: paths.antDir, //antd
  // stylesDir: paths.stylesDir, //styles directory containing all less files
  // varFile: paths.varFile, //less变量文件，包含antd已有变量和自定义变量
  // mainLessFile: paths.mainLessFile, //less main file which imports all other custom styles
  // outputFilePath: paths.outputFilePath,
  antDir: path.resolve(__dirname, '../node_modules/antd'), 
  stylesDir: path.resolve(__dirname, '../src/assets/style'), 
  varFile: path.resolve(__dirname, '../src/assets/style/vars.less'), 
  mainLessFile: path.resolve(__dirname, '../src/assets/style/main.less'), 
  outputFilePath: path.resolve(__dirname, '../public/resource/color.less'),
  themeVariables: [
    '@primary-color',
    '@primary-color2',
    '@header-bg',
    '@menu-bg',
    '@bg-gradient',
    '@lightbg1',
    '@lightbg2',
    '@all-active-orange',
    '@c-main',
    '@community-borderColor'
  ],
}

generateTheme(options).then(() => {
  console.log('Theme generated successfully');
}).catch(error => {
  console.log('Error', error);
});
