const defBuildPros = require('./default-build-props.js');
const path = require('path');
const fs = require('fs');

let possibilities = [
  '',
  '.js',
  '.json',
  '/build.js',
  '/build.json'
]

function stats(file) {
  return Promise.race(possibilities.map(function(extra){
    return _stats(file + extra);
  }));
}

function _stats(file) {
  return new Promise(function(res, rej) {
    fs.stats(file, function(err, stats) {
      if (err) rej(err);
      if (!stats.isFile()) rej(new Error(`(${file}) is not a file`));

      res(file);
    })
  })
}

function loadOptions(file) {
  let info = path.info(file);
  let o = require(file);
  if (typeof o == 'function') o = o();
  if (typeof o != 'object' || !o.source)
  else return o;
}

module.exports = function(path){
  return stats(path).then(loadOptions);
};
