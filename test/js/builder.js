const {expect} = require('chai').use(require("chai-as-promised"));

const builder = require('../../src/builder');
const Builder = builder.Builder;

describe('builder', function() {
  describe("default build", function() {
    it('should initialize a default build environment', function() {
      let builder = new Builder();
      expect(builder).to.be.an.instanceof(Builder);
      expect(builder.env.version).to.be.ok;
    });
  })

  describe("use", function() {
    it ("should import environment data", function() {
      let builder = builder();
      builder.import({common: {testing: true}})
      expect(builder.env.testing).to.be.true;
    })
  })

  describe("loadProject", function(){
    it ("should load a project file from json", function() {
      let _builder = new Builder();
      return _builder.loadBuildFile('./resources/build.json')
      .then(build=>{
        expect(build.method).to.equal('json');
      });
    });
  });

  describe("build", function() {
    it ('Should throw a not implemented error', function() {
      let buildPromise = new Builder().build();
      return buildPromise.should.rejectWith(/ENOI/);
    })
  })

  describe("clean", function() {
    it ('should throw a not implemented error', function() {
      let buildPromise = new Builder().build();
      return buildPromise.should.rejectWith(/ENOI/);
    })
  })
})
