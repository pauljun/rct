'use strict';
const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const utils = require('../scripts/utils');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const lessRegex = /\.less$/;

const getStyleLoaders = (cssOptions, preProcessor, otherOptions) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
      )
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          })
        ]
      }
    }
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: otherOptions
    });
  }
  return loaders;
};

module.exports = function(config) {
  const inPaths = Object.keys(config.entry).map(key => paths.resolveApp(path.parse(config.entry[key]).dir));
  const library = config.globalName ? config.globalName : '[name]';
  const libraryTarget = config.globalName ? 'window' : 'umd';
  return {
    mode: 'production',
    bail: true,
    devtool: shouldUseSourceMap ? 'source-map' : false,
    entry: config.entry,
    output: {
      // The build folder.
      path: config.path,
      filename: config.output,
      library,
      publicPath: publicPath,
      libraryExport: 'default',
      libraryTarget: libraryTarget, // 通用模块定义
      umdNamedDefine: true
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          parallel: true,
          cache: true,
          sourceMap: shouldUseSourceMap
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true
                }
              : false
          }
        })
      ],
      splitChunks: {
        chunks: 'async',
        name: false
      },
      runtimeChunk: false
    },
    resolve: {
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`).filter(ext => !ext.includes('ts')),
      alias: require('./alias'),
      plugins: [PnpWebpackPlugin]
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: true } },
        {
          test: /\.(js|mjs|jsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint')
              },
              loader: require.resolve('eslint-loader')
            }
          ],
          include: inPaths
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]'
              }
            },

            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'
                        }
                      }
                    }
                  ]
                ],
                cacheDirectory: true,
                cacheCompression: true,
                compact: true
              }
            },
            {
              test: cssRegex,
              loader: getStyleLoaders({
                importLoaders: 1,
                sourceMap: shouldUseSourceMap
              }),
              sideEffects: true
            },
            {
              test: sassRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: shouldUseSourceMap
                },
                'sass-loader'
              ),
              sideEffects: true
            },
            {
              test: lessRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: true
                },
                'less-loader',
                {
                  javascriptEnabled: true
                }
              ),
              sideEffects: true
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    },
    // 使用来自 JavaScript 运行环境提供的全局变量
    externals: require(paths.appPackageJson).externals,
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name]/[name].css',
        chunkFilename: 'static/css/[name]/[name].chunk.css'
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: publicPath,
        generate: (seed, files) => {
          const json = files.reduce((manifest, { name, path }) => ({ ...manifest, [name]: path }), seed);
          utils.event.emit('manifest', json);
          return json;
        }
      }),
      
    ]
  };
};
