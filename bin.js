#!/usr/bin/env node

const main = require('.');

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
