const defaultBuild = require('./default-build.js');
const merge = require('./merge.js');
const clone = require('clone');
const os = require('os');
const fileLoader = require('./file-loader.js');
const path = require('path');
const _eval = require('eval');
const debug = require('debug')('ama:builder');

let buildFilePossibilities = [
  '',
  '.js',
  '.json',
  '/build.js',
  '/build.json'
];

module.exports = function(project) {
  return Builder.loadBuilder(project);
}

class Builder {
  constructor() {
    this.reset();
  }

  reset() {
    debug('Reseting builder');
    this.targets = clone(defaultBuild.targets);
    this.profiles = clone(defaultBuild.profiles);
    this.env = clone(defaultBuild.env);
  }

  use(build) {
    debug('importing build data');
    if (build.env) merge(this.env, build.env);
    if (build.targets) this.targets.push(...build.targets);
    if (build.profiles) merge(this.profiles, build.profiles);
    return this;
  }

  loadProject(buildFile) {
    debug('loading build project');
    return fileLoader(buildFile, ...Builder.BuildFileSearchTypes).then(d => {
      this.reset();
      let info = path.parse(d.file);

      this.env.projectRoot = info.dir;
      this.env.projectName = info.name;

      let project;

      switch (info.ext) {
        case '.json': project = JSON.parse(d.buff.toString()); break;
        case '.js': project = _eval(d.buff.toString(), d.file, this, true); break;
      }

      if (!project) throw new Error("Invalid project file!");

      this.use(project);
      return this;
    }, (err) => {
      debug("Project file not found @ %s", buildFile);
      throw err;
    });
  }

  _mergeTargets(profile, cb) {
    debug('performing target merge/iteration');
    let env = clone(this.env);

    if (profile) {
      if (this.profiles[profile] === undefined)
      return Promise.reject(new Error('ENOP: Invalid profile: ' + profile));

      merge(env, this.profiles[profile]);
    }

    return Promise.all(this.targets.map((target) => {
      return cb(merge(clone(env), target));
    }));
  }

  build(profile) {
    debug('initiating build');
    if (!this._build) {
      let err = new Error("ENOI: Build is currently not supported on this platform.");
      err.profile = profile;
      return Promise.reject(err);
    }

    return this._mergeTargets(profile, target => {
      return this._build(target);
    });
  }

  clean(profile) {
    debug('initiating clean');
    if (!this._clean) {
      let err = new Error("ENOI: Clean is currently not supported on this platform.");
      err.profile = profile;
      return Promise.reject(err);
    }

    return this._mergeTargets(profile, target => {
      return this._clean(target);
    });
  }

  static loadBuilder(project, _os=os.type()) {
    let _builder = new (require(`./builder-${_os}.js`))();
    if (project) return _builder.loadProject(project);
    else return Promise.resolve(_builder);
  }
}

Builder.BuildFileSearchTypes = buildFilePossibilities;
module.exports.Builder = Builder;
