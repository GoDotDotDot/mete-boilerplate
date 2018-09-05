/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true

const workingPath = process.cwd()
const lessToJs = require('less-vars-to-js')
const themeVariables = lessToJs(fs.readFileSync(path.resolve(workingPath, 'app/theme.less'), 'utf8'))

module.exports = (options) => ({
  // entry: ['babel-polyfill', ...options.entry],
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(workingPath, 'build'),
    publicPath: '/'
  }, options.output), // Merge with env dependent settings
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transform all .js files required somewhere with Babel
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options:
          Object.assign({
            presets: [['es2015', { 'modules': false }], 'react', 'stage-0'],
            cacheDirectory: true,
          // Since babel-plugin-transform-runtime includes a polyfill that includes a custom regenerator runtime and core.js, the following usual shimming method using webpack.ProvidePlugin will not work:
            plugins: [
              ['import', { libraryName: 'antd', style: true }] // `style: true` 会加载 less 文件
            ]
          }, options.babelQuery)
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              minimize: options.isProd
            }}, 'postcss-loader']
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
       // scss loader
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          // {loader: 'autoprefixer-loader'},
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // module: true, // css-loader 0.14.5 compatible
              // modules: true
              // localIdentName: '[hash:base64:5]'
              // importLoaders: 1,
              minimize: options.isProd
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              // outputStyle: 'collapsed',
              sourceMap: true,
              includePaths: ['app']
            }
          }
        ]
      },
      // less loader
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
            // module: true, // css-loader 0.14.5 compatible
            // modules: true
            // localIdentName: '[hash:base64:5]'
            // importLoaders: 1,
              minimize: options.isProd
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader',
            options: {
            // outputStyle: 'collapsed',
              modifyVars: themeVariables,
              sourceMap: true
              // includePaths: [path.resolve(workingPath, 'app')]
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=8024&name=assets/fonts/[name].[ext]',
        options: {
          publicPath: '/'
        }
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: [
          {
            loader: 'url-loader?limit=8024&',
            options: {
              limit: '8024',
              name: '[name]-[hash].[ext]',
              publicPath: '/assets/images/', // 打包显示的地址
              outputPath: 'assets/images' // 打包过后文件放置的地址
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: !options.isProd,
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: true
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: true
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
  mode: options.mode || 'development',
  plugins: options.plugins.concat([
      // create css bundle
    new MiniCssExtractPlugin({filename: options.isProd ? 'css/[name]-[contenthash].css' : 'css/[name].css'}),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch'
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NamedModulesPlugin()
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
      '.scss'
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main'
    ]
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {}
})
