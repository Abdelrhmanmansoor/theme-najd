const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin   = require('css-minimizer-webpack-plugin');
const ThemeWatcher          = require('@salla.sa/twilight/watcher.js');
const CopyPlugin            = require('copy-webpack-plugin');
const path                  = require('path');

const asset  = (file = '') => path.resolve('src/assets', file);
const public = (file = '') => path.resolve('public', file);

module.exports = {
  entry: {
    app:       [asset('styles/app.scss'), asset('js/app.js')],
    home:      asset('js/home.js'),
    product:   asset('js/product.js'),
    checkout:  asset('js/checkout.js'),
    'product-card': asset('js/partials/product-card.js'),
    'main-menu':    asset('js/partials/main-menu.js'),
    'theme-mode':   asset('js/partials/theme-mode.js'),
    'liquid-glass': asset('js/partials/liquid-glass.js'),
  },

  output: {
    path:  public(),
    clean: true,
    chunkFilename: '[name].[contenthash].js',
  },

  stats: { modules: false, assetsSort: 'size', assetsSpace: 50 },

  module: {
    rules: [
      {
        test:    /\.js$/,
        exclude: [/(node_modules)/, asset('js/twilight.js')],
        use: {
          loader:  'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-runtime', { regenerator: true }]],
          },
        },
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new ThemeWatcher(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({ patterns: [{ from: asset('images'), to: public('images') }] }),
  ],

  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
};
