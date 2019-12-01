require('dotenv').config();
const Path = require('path')
const yargs = require('yargs');

const { argv } = yargs.options({
  cwd: { type: 'string', default: 'process.cwd()' },
  rollup: { type: 'boolean' },
  node_modules: { type: 'string', default: 'node_modules' },
  output: { type: 'string', default: 'packed-dependencies' },
  watch: { type: 'boolean', alias: ['w'] },
  dev: { type: 'boolean', alias: ['d'] },
  mode: { type: 'string', default: 'production' },
  target: { type: 'string', default: 'web' },
  ignoredModules: { type: 'array' },
  all: { type: 'boolean' },
  halt: { type: 'boolean' },
}).env('packed-dependencies');

const config = { ...argv };

config.cwd = config.cwd.replace('process.cwd()', process.cwd());
if (!Path.isAbsolute(config.output)) {
  config.output = Path.join(config.cwd, config.output);
}
if (config.dev) {
  config.mode = 'development';
}
if (config.mode.startsWith('dev')) {
  config.mode = 'development';
}
if (config.mode.startsWith('prod')) {
  config.mode = 'production';
}
if (config.mode === 'development') {
  config.dev = true;
}

config.child = child => Object.assign({}, config, child);

module.exports = { ...config };
