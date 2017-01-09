const {expect} = require('chai');
const convert2flags = require('../../src/convert2flags-windows.js');

let simpleTestObject = {
  define: ['SIMPLE_TEST_MACRO'],
  include: ['./simple_include'],
  cflags: ['SIMPLE_C_FLAG'],
  source: ['simple.c'],
  lib: ['simple.lib'],
  output: 'simple.exe',
  lflags: ['SIMPLE_LINKER_FLAG']
}
let simpleTestResult =
"/DSIMPLE_TEST_MACRO /I ./simple_include /SIMPLE_C_FLAG simple.c simple.lib /link /OUT:simple.exe /SIMPLE_LINKER_FLAG";

describe('convert2flags', function() {
  it('should take an object and convert its properties to flags', function() {
    expect(convert2flags(simpleTestObject).join(' '))
    .to.eql(simpleTestResult);
  })
})
