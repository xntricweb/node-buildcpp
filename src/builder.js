const defaultBuild = require('./default-build.js');
const merge = require('./merge.js');
const clone = require('clone');
const os = require('os');
const buildFileLoader = require('./build-options.js');

module.exports = function(buildFile) {
  let builder;
  switch (os.type()) {
    case 'Windows_NT':
      builder = require('./windows-build-helper.js')();
      break;
    default:
      throw new Error("unsupported os");
  }

  return builder.loadBuildFile(buildFile);
}

class Builder {
  constructor(buildFile) {
    this.__targets = [];
    this.__profile = {};
    this.__build = {};
    this.addBuildProperties(clone(defaultBuild));

    if (buildFile) this.loadBuildFile(buildFile);
  }

  addBuildProperties(build) {
    if (build.common) merge(this.__build, build.common);
    if (build.target) this.__targets.push(...build.targets);
    if (build.profile) merge(this.__profile, build.profile);
  }

  loadBuildFile(buildFile) {
    return buildFileLoader(buildFile).then((build) => {
      this.addBuildProperties(build);
      return this;
    })
  }

  build(profile) {
    return new Promise((res, rej) => {
      if (!this._build) {
        let err = new Error("Build is currently not supported on this platform.");
        err.target = target;
        rej(err);
      }

      let build = clone(this.__build);

      if (profile) {
        if (build.profile[profile] === undefined)
          return rej(new Error('Invalid profile: ' + profile));
        merge(build, build.profile[profile]);
      }

      let targets = this.__target;
      return Promise.all(targets.map((target) => {
        return this._build(merge(clone(build), target));
      }));
    });
  }

  clean(profile) {
    return new Promise(res, rej) {
      if (!this._clean) {
        let err = new Error("Clean is currently not supported on this platform.");
        err.target = target;
        rej(err);
      }
      return this._clean(profile);
    }
  }
}

module.exports.Builder = Builder;
