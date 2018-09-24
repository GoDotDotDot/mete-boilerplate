// Important modules this config uses
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OfflinePlugin = require("offline-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const workPath = process.cwd();
module.exports = require("./webpack.base.babel")({
  // In production, we skip all hot-reloading stuff
  entry: {
    react_vendor: ['react', 'react-dom', 'react-router-dom'],
    redux_vendor: ['react-redux','redux', 'redux-immutable','redux-saga', 'immutable'],
    app: path.join(process.cwd(),'app/app.js')
    // login: [ ...hotEntry, path.join(process.cwd(), 'app/pages/Login/index.js') ]
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: "js/[name]-[chunkhash].bundle.js",
    chunkFilename: "js/[id]-[chunkhash].bundle.js",
    publicPath: "./"
  },
  mode: "production",

  plugins: [
    new CleanWebpackPlugin(["build"], {
      root: workPath
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: "app/templates/index.pro.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    // minify remove some of the dead code
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     conditionals: true,
    //     unused: true,
    //     comparisons: true,
    //     sequences: true,
    //     dead_code: true,
    //     if_return: true,
    //     join_vars: true
    //   }
    // }),
    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new OfflinePlugin({
      relativePaths: true,
      publicPath: "./",

      // No need to cache .htaccess. See http://mxs.is/googmp,
      // this is applied before any match in `caches` section
      excludes: [".htaccess"],

      caches: {
        main: [":rest:"],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        additional: ["*.bundle.js", "*.css"]
      },

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,

      AppCache: false
    })
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  },
  optimization: {
    minimize: true,
    nodeEnv: "production",
    sideEffects: true,
    concatenateModules: true,
    splitChunks: { chunks: "all" },
    runtimeChunk: true
  },
  isProd: true
});
