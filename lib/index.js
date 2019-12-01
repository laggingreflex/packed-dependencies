const Path = require('path')
const fs = require('fs-extra');
const mainConfig = require('./config');
const webpack = require('./webpack');
const rollup = require('./rollup');

module.exports = main;

async function main(config = {}) {
  config = mainConfig.child(config);
  const packageJson = await fs.readJson(Path.join(config.cwd, 'package.json'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  if (config.all) {
    dependencies.push(...Object.keys(packageJson.devDependencies || {}));
  }
  console.log(`Bundling ${dependencies.length} dependencies...`);
  const errors = [];
  for (const dependency of dependencies) {
    const path = Path.join(config.cwd || process.cwd(), config.node_modules || 'node_modules', dependency);
    try {
      console.log('Processing', dependency);
      if (config.rollup) {
        await rollup({ dependency, path }, config);
      } else {
        await webpack({ dependency, path }, config);
      }
    } catch (error) {
      errors.push({ dependency, error })
      if (config.halt) break;
    }
  }
  if (errors.length) {
    console.error(`Errors encountered while processing ${errors.length} dependencies:`);
    for (const { dependency, error } of errors) {
      console.error(`Error processing ${dependency}`);
      console.error(error);
    }
    throw new Error(`Failed to process (at least) ${errors.length}/${dependencies.length} dependencies`);
  } else {
    console.log(`Bundled ${dependencies.length} dependencies!`);
  }
}
