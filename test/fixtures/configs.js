'use strict';

const rspack = require('@rspack/core');

const path = require('node:path');
const tmpDir = require('node:os').tmpdir();

function getWorkspace() {
  return path.join(tmpDir, 'rspack-assets-manifest');
}

function randomString(length) {
  let str = '';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  while (length--) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
}

function tmpDirPath() {
  return path.join(getWorkspace(), randomString(8));
}

function hello() {
  return {
    mode: 'development',
    entry: {
      main: path.resolve(__dirname, './hello.js'),
    },
    output: {
      path: tmpDirPath(),
    },
    module: {
      rules: [],
    },
    plugins: [],
  };
}

function client(hashed = false) {
  return {
    mode: 'development',
    target: 'web',
    entry: {
      client: path.resolve(__dirname, './client.js'),
    },
    output: {
      path: tmpDirPath(),
      filename: hashed ? '[name]-[contenthash:6].js' : '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.loader\.jpg$/i,
          loader: 'file-loader',
          options: {
            name: hashed ? 'images/[name]-[contenthash:6].[ext]' : 'images/[name].[ext]',
          },
        },
        {
          test: /\.asset\.jpg$/i,
          type: 'asset/resource',
          generator: {
            filename: hashed ? 'images/[name]-[contenthash:6][ext]' : 'images/[name][ext]',
          },
        },
      ],
    },
    plugins: [],
  };
}

function styles() {
  return {
    mode: 'development',
    target: 'web',
    entry: {
      styles: path.resolve(__dirname, './load-styles.mjs'),
    },
    output: {
      path: tmpDirPath(),
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.jpg$/i,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
          },
        },
        {
          test: /\.css$/,
          use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new rspack.CssExtractRspackPlugin({
        filename: '[name].css',
      }),
    ],
  };
}

function copy() {
  const config = hello();

  config.plugins.push(
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'readme.md'),
          to: './readme-copied.md',
        },
      ],
    }),
  );

  return config;
}

function compression() {
  const CompressionPlugin = require('compression-webpack-plugin');

  const config = hello();

  config.plugins.push(new CompressionPlugin());

  return config;
}

function complex() {
  return {
    mode: 'development',
    target: 'web',
    context: __dirname,
    entry: {
      main: './main.js',
      complex: './complex.mjs',
    },
    output: {
      path: tmpDirPath(),
      filename: '[name]-HASH.js',
      publicPath: 'https://assets.example.com/',
    },
    module: {
      rules: [
        {
          test: /\.loader\.jpg$/i,
          loader: 'file-loader',
          options: {
            name: 'images/HASH.[ext]',
          },
        },
        {
          test: /\.asset\.jpg$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/HASH[ext][query]',
          },
        },
        {
          test: /\.css$/,
          use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new rspack.CssExtractRspackPlugin({
        filename: '[name]-HASH.css',
      }),
    ],
  };
}

function server() {
  return {
    mode: 'development',
    target: 'node',
    entry: {
      server: path.resolve(__dirname, './server.js'),
    },
    output: {
      path: tmpDirPath(),
      filename: '[name].js',
    },
    module: {
      rules: [],
    },
    plugins: [],
  };
}

function devServer(outputPath) {
  outputPath = outputPath || '/';

  const config = server();

  config.devServer = { outputPath };
  config.output.path = outputPath;

  return config;
}

function multi() {
  const clientConfig = client();
  const serverConfig = server();

  clientConfig.output.path = serverConfig.output.path = tmpDirPath();

  return [clientConfig, serverConfig];
}

module.exports = {
  hello,
  client,
  server,
  styles,
  copy,
  compression,
  complex,
  devServer,
  multi,
  tmpDirPath,
  getWorkspace,
};
