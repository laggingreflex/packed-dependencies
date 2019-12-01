const webpack = require('webpack-simple-node-api');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const { camelCase } = require('lodash');
const mainConfig = require('../config');

module.exports = main;

async function main({ dependency, path }, config) {
  config = mainConfig.child(config);
  const entry = require.resolve(path);
  const { build, watch } = await webpack({
    entry,
    output: {
      path: config.output,
      filename: dependency + '.js',
      library: camelCase(dependency),
    },
    mode: config.mode || 'production',
    target: config.target || 'web',
    plugins: [new EsmWebpackPlugin()],
  });
  if (config.watch) {
    await watch();
  } else {
    await build({ log: false });
  }
}
