const assert = require('assert');
const merge = require('../../src/merge.js');

describe('merge', function() {
  it('should merge two simple objects', function() {
    let target = {a: 0, b: 1, c: 2};
    let source = {b: 4, d: 5};

    let result = merge(target, source);

    let expected = {a: 0, b: 4, c: 2, d: 5};
    assert(result === target, "merge should return the modified target");
    assert.deepEqual(result, expected, "merge should merge the source into the target");
  });

  it('should concatenate arrays in objects', function() {
    let target = {a: 0, b:[0,1,2], c: [{d:5, e:6}]};
    let source = {b: [0, 3], c: {d: 7, e: 8}};
    let result = merge(target, source);
    let expected = {a: 0, b:[0,1,2,0,3], c: [{d:5, e:6},{d:7, e:8}]};

    assert.deepEqual(result, expected, "merge should concatenate arrays");
  });

  it('should throw an error for invalid conversions', function() {
    let target = {a:"a", b:{c: 1}};
    let expected = {a:"a", b:{c: 1}};
    assert.throws(function() {
      let source = {a:{b:0}};
      merge(target, source);
    }, /object.*primitive/, "Should not be able to convert an object to a primitive");

    assert.throws(function() {
      let source = {a: [0]}
      merge(target, source);
    }, /array.*primitive/, "Should not be able to convert an array to a primitive");

    assert.throws(function() {
      let source = {b:"stuff"};
      merge(target, source);
    }, /primitive.*object/, "Should not be able to convert a primitive to an object");
    
    assert.throws(function() {
      let source = {b:[0,1,2]};
      merge(target, source);
    }, /array.*object/, "Should not be able to convert a array to an object");
  });
});
