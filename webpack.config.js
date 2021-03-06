const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// var webpack = require('webpack');
const config = './js/popup/configuration-pages/';
const deps = './js/extension/dependencies/';
const features = './js/extension/features/';

module.exports = {
  entry: {
    // popup.js
    './js/popup/popup-logic/popup': './js/popup/popup-logic/popup.js',
    // background.js
    './js/extension/background': './js/extension/background.js',
    // dependencies
    [deps + 'analytics/analytics']: `${deps}analytics/analytics.js`,
    [deps + 'exchange-rates/update-exchange-rates']: `${deps}exchange-rates/update-exchange-rates.js`,
    [deps + 'options/options']: `${deps}options/options.js`,
    [deps + 'resource-library/resource-library']: `${deps}resource-library/resource-library.js`,
    [deps + 'runtime-messages/runtime-messages']: `${deps}runtime-messages/runtime-messages.js`,
    [deps + 'tests/unit-tests']: `${deps}tests/unit-tests.js`,
    // features files
    [features + 'apply-highlights']: `${features}apply-highlights.js`,
    [features + 'average-price']: `${features}average-price.js`,
    [features + 'better-collection-ui']: `${features}better-collection-ui.js`,
    [features + 'block-sellers']: `${features}block-sellers.js`,
    [features + 'blurry-image-fix']: `${features}blurry-image-fix.js`,
    /* [features + 'contextual-menu-search']: <-- Special case: transpiling breaks stuff so needs to be copied via CopyWebpackPlugin below */
    [features + 'collection-new-tabs']: `${features}collection-new-tabs.js`,
    [features + 'currency-converter']: `${features}currency-converter.js`,
    [features + 'everlasting-collection-notes']: `${features}everlasting-collection-notes.js`,
    [features + 'everlasting-collection-ratings']: `${features}everlasting-collection-ratings.js`,
    [features + 'everlasting-collection-sm-med']: `${features}everlasting-collection-sm-med.js`,
    [features + 'everlasting-marketplace-release-page']: `${features}everlasting-marketplace-release-page.js`,
    [features + 'everlasting-marketplace']: `${features}everlasting-marketplace.js`,
    [features + 'favorite-sellers']: `${features}favorite-sellers.js`,
    [features + 'feedback-notifier']: `${features}feedback-notifier.js`,
    [features + 'filter-media-condition']: `${features}filter-media-condition.js`,
    [features + 'filter-monitor']: `${features}filter-monitor.js`,
    [features + 'filter-shipping-country']: `${features}filter-shipping-country.js`,
    [features + 'filter-sleeve-condition']: `${features}filter-sleeve-condition.js`,
    [features + 'friend-counter']: `${features}friend-counter.js`,
    [features + 'highlight-comments']: `${features}highlight-comments.js`,
    [features + 'notes-counter']: `${features}notes-counter.js`,
    [features + 'random-item']: `${features}random-item.js`,
    [features + 'rating-percent']: `${features}rating-percent.js`,
    [features + 'release-durations']: `${features}release-durations.js`,
    [features + 'release-history-legend']: `${features}release-history-legend.js`,
    [features + 'release-ratings']: `${features}release-ratings.js`,
    [features + 'release-scanner']: `${features}release-scanner.js`,
    [features + 'remove-from-wantlist']: `${features}remove-from-wantlist.js`,
    [features + 'seller-rep']: `${features}seller-rep.js`,
    [features + 'sort-explore-lists']: `${features}sort-explore-lists.js`,
    [features + 'sort-marketplace-lists']: `${features}sort-marketplace-lists.js`,
    [features + 'sort-personal-lists']: `${features}sort-personal-lists.js`,
    [features + 'suggested-prices-release-page']: `${features}suggested-prices-release-page.js`,
    [features + 'suggested-prices-single']: `${features}suggested-prices-single.js`,
    [features + 'text-format-shortcuts']: `${features}text-format-shortcuts.js`,
    [features + 'toggle-absolute-date']: `${features}toggle-absolute-date.js`,
    [features + 'toggle-baoi-fields']: `${features}toggle-baoi-fields.js`,
    [features + 'toggle-dark-theme']: `${features}toggle-dark-theme.js`,
    [features + 'toggle-filter-shipping-country-css']: `${features}toggle-filter-shipping-country-css.js`,
    [features + 'toggle-highlights']: `${features}toggle-highlights.js`,
    [features + 'toggle-min-max-columns']: `${features}toggle-min-max-columns.js`,
    [features + 'toggle-youtube-playlists']: `${features}toggle-youtube-playlists.js`,
    [features + 'tracklist-readability']: `${features}tracklist-readability.js`,
    // popup configs
    [config + 'blocked-sellers']: `${config}blocked-sellers.js`,
    [config + 'favorite-sellers']: `${config}favorite-sellers.js`,
    [config + 'filter-shipping-country']: `${config}filter-shipping-country.js`,
    [config + 'learn']: `${config}learn.js`,
    [config + 'readability']: `${config}readability.js`,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-async-to-generator'],
          presets: ['es2016']
        },
      },
      {
       test: /\.(png|jpg|gif|svg)$/,
       use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
  // Uncomment for maximum minification
  // new webpack.optimize.UglifyJsPlugin(),

  // move all this stuff into the /dist folder
  new CopyWebpackPlugin([
    { from: 'manifest.json', to: 'manifest.json' },
    { from: 'html', to: 'html' },
    // CSS assets
    { from: 'css', to: 'css' },
    { from: 'img', to: 'img' },
    // contextual menu searching
    { from: 'js/extension/features/contextual-menu-search.js', to: 'js/extension/features/contextual-menu-search.js' }
  ]),
 ]
};
