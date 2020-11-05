// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

/**
 * This is Webpack's configuration file. See https://webpack.js.org/configuration/.
 *
 * Webpack bundles all front end components into a single JavaScript file which is
 * then loaded in the browser.
 */
const webpack = require('webpack');

// Use the Node.js path module for path resolution below.
const path = require('path');

const config = {
  // Defaults to ./src
  // Here the application starts executing and webpack starts bundling.
  entry:  path.resolve(__dirname + '/src/index.js'), // string | object | array

  // Options related to how webpack emits results.
  output: {
    // The target directory for all output files must be an absolute path.
    path: path.resolve(__dirname + '/dist'), // string

    // The filename template for entry chunks.
    filename: 'bundle.js',
  },

  // Options for resolving module requests (does not apply to resolving to loaders).
  resolve: {
    // Extensions that are used.
    extensions: ['.js', '.jsx', '.css']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        exclude: /node_modules/,
        use: {
          // Tell Webpack to use Babel to transpile our JavaScript to make sense in browsers.
          loader: 'babel-loader',
          options: {
            presets: [
              // For compiling modern JavaScript down to ES5.
              '@babel/preset-env',
              // For compiling JSX (React JavaScript) down to JavaScript.
              '@babel/preset-react',
            ],
          }
        },
      }
    ]
  }
};
module.exports = config;