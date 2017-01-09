const {expect} = require('chai').use(require("chai-as-promised"));

const builder = require('../../src/builder');
const Builder = builder.Builder;

class TestBuilder extends Builder {
  _build(target) {
    return new Promise((res, rej)=> {
      setTimeout(res, 0, target);
    });
  }
  _clean(target) {
    return new Promise((res, rej)=> {
      setTimeout(res, 0, target);
    });
  }
}

describe('builder', function() {
  describe("default build", function() {
    it('should initialize a default build environment', function() {
      let _builder = new Builder();
      expect(_builder).to.be.an.instanceof(Builder);
      expect(_builder.env.version).to.be.ok;
    });
  })

  describe("use", function() {
    it ("should import environment data", function() {
      let _builder = builder();
      return builder().then(b=>{
        b.use({env: {testing: true}});
        expect(b.env.testing).to.be.true;
      });
    })
  })

  describe("loadProject", function(){
    it ("should load a project file from json", function() {
      return new Builder().loadProject(`${__dirname}/resources/build.json`)
      .then((builder) => {
        expect(builder.env).to.have.a.property('parts');
      });
    });

    it ("should load a project if supplied to the loader", function() {
      return builder(`${__dirname}/resources`).then(builder => {
        expect(builder.env).to.have.a.property('parts');
      });
    })
  });

  describe("build", function() {
    it ('Should throw a not implemented error from the interface', function() {
      return expect(new Builder().build()).to.be.rejectedWith(/ENOI/);
    })

    it ('Should call _build on children with a target', function() {
      return new TestBuilder().loadProject(`${__dirname}/resources`)
      .then(builder => {
        return expect(builder.build("test")).to.eventually.satisfy(targets=> {
          expect(targets[0].parts).to.eql(["env", "profile", "target1"]);
          expect(targets[1].parts).to.eql(["env", "profile", "target2"]);
          return true;
        });
      });
    })
  })

  describe("clean", function() {
    it ('should throw a not implemented error', function() {
      return expect(new Builder().clean()).to.be.rejectedWith(/ENOI/);
    })

    it ('Should call _clean on children with a target', function() {
      return new TestBuilder().loadProject(`${__dirname}/resources`)
      .then(builder => {
        return expect(builder.build("test")).to.eventually.satisfy(targets=> {
          expect(targets[0].parts).to.eql(["env", "profile", "target1"]);
          expect(targets[1].parts).to.eql(["env", "profile", "target2"]);
          return true;
        });
      });
    })
  })
})
