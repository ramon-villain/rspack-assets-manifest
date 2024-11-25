'use strict';

const { rspack } = require('@rspack/core');
const MemoryFs = require('memory-fs');

function makeCompiler(config) {
  const compiler = rspack(config);

  compiler.outputFileSystem = new MemoryFs();

  return compiler;
}

module.exports = makeCompiler;
