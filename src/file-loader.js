// const defBuildPros = require('./default-build-props.js');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const debug = require('debug')('ama:file-loader');

// const _eval = require('eval');
const path = require('path');

module.exports = function(...args) {
  let root = args.shift();
  if (!root) return Promise.reject(new Error('Invalid file name'));

  if (!args.length) return fs.readFileAsync(root).then(buff=>{file:root, buff});

  return Promise.any(args.map(suffix => {
    let file = root + suffix;
    return fs.readFileAsync(file)
    .then(buff=>({file, buff}))
  }))
  .catch(Promise.AggregateError, err => {
    throw new Error(`ENOENT: no such file "${args.join('", "')}" at ${root}`);
  });
}
