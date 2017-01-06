const assert = require('assert');
const fileLoader = require('../../src/file-loader.js');
const {AggregateError} = require('bluebird');

describe("file-loader", function() {
  it("should load a file directly", function() {
    return fileLoader(`${__dirname}/resources/file-loader-test.json`);
  });
  it("should load a file using a possibility", function()  {
    return fileLoader(`${__dirname}/resources/file-loader-test`, '.json');
  })
  it("should load a file using a list of possibilities", function() {
    return fileLoader(`${__dirname}/resources/`, ...[
      '',
      '.json',
      'file-loader-test.json',
      'file-test.js'
    ])
  })
  it("should throw an Aggregate error if not found", function() {
    return fileLoader(`${__dirname}/resources/`, '.does', '.not', '.exist')
    .then(() => { throw new Error("ENOENT not thrown."); })
    .catch(err => { assert(/ENOENT/.test(err),
      "Incorrect error thrown " + err); });
  })
})
