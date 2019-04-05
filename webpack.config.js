const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = {
  mode: 'production',
  entry: './source/resource/exposed.js',
  output: {
    filename: 'gqcpr.js',
    path: path.resolve(__dirname, './source/resource/js/gqcpr.js')
  },

  plugins: [
    new LicenseWebpackPlugin({addBanner: true})
  ],

  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
}
