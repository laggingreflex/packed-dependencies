const Path = require('path')
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve')
const mainConfig = require('../config');

module.exports = main;

async function main({ dependency, path }, config) {
  // throw new Error(`Rollup hasn't been implemented yet`)
  const entry = require.resolve(path);
  config = mainConfig.child(config);
  const plugins = [nodeResolve({}), commonjs({})];
  const options = {
    input: {
      // input: path,
      input: entry,
      plugins,
    },
    output: {
      format: 'esm',
      // dir: config.output,
      // file: dependency + '.js',
      file: Path.join(config.output, dependency + '.js'),
      plugins,
    }
  };
  const bundle = await rollup.rollup(options.input);
  console.log(bundle.watchFiles); // an array of file names this bundle depends on
  const { output } = await bundle.generate(options.output);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'asset') {
      console.log('Asset', chunkOrAsset);
    } else {
      console.log('Chunk', chunkOrAsset.modules);
    }
  }

  await bundle.write(options.output);
}
