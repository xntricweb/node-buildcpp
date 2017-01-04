const cl = require('../../src/command-line.js');
const assert = require('assert');

describe('command-line-parser', function() {
  it('should get a default mode and target from an empty array list', function() {
    let result = cl([]);
    assert.deepEqual(result, {
      mode: 'build',
      target: process.cwd()
    }, "Expected default mode and targets");
  });
  it('should get a mode and target from an array list', function() {
    let result = cl(['clean', 'my target']);
    assert.deepEqual(result, {
      mode: 'clean',
      target: 'my target'
    }, "Expected custom mode and targets");
  });
  it('should get a custom mode and default target from an array list', function() {
    let result = cl(['clean']);
    assert.deepEqual(result, {
      mode: 'clean',
      target: process.cwd()
    }, "Expected custom mode and default target");
  });
  it('should get a default mode and custom target from an array list', function() {
    let result = cl(['my target']);
    assert.deepEqual(result, {
      mode: 'build',
      target: 'my target'
    }, "Expected default mode and custom target");
  });
})
