const defaultBuild = require('./default-build.js');
const merge = require('./merge.js');
const clone = require('clone');
const os = require('os');
const fileLoader = require('./file-loader.js');

let buildFilePossibilities = [
  '',
  '.js',
  '.json',
  '/build.js',
  '/build.json'
];

module.exports = function(buildFile) {
  let builder;

  return builder.loadBuildFile(buildFile);
}

class Builder {
  constructor(buildFile) {
    this.targets = [];
    this.profiles = {};
    this.env = {};

    this.use(clone(defaultBuild));
    if (buildFile) this.loadProject(buildFile);
  }

  use(build) {
    if (build.env) merge(this.env, build.env);
    if (build.targets) this.targets.push(...build.targets);
    if (build.profiles) merge(this.profiles, build.profiles);
  }

  loadProject(buildFile) {
    return fileLoader(buildFile, Builder.BuildFileSearchTypes).then(d => {
      let info = path.info(d.file);
      this.root = info.dir;
      this.name = info.name;

      let project;

      switch (info.ext) {
        case 'json': project = JSON.parse(d.buff.toString); break;
        case 'js': project = _eval(d.buff, this, true); break;
      }

      if (!project) throw new Error("Invalid project file!");

      this.use(project);
      return this;
    });
  }

  build(profile) {
    return new Promise((res, rej) => {
      if (!this._build) {
        let err = new Error("ENOI: Build is currently not supported on this platform.");
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
    return new Promise((res, rej) => {
      if (!this._clean) {
        let err = new Error("ENOI: Clean is currently not supported on this platform.");
        err.target = target;
        rej(err);
      }
      return this._clean(profile);
    });
  }

  static loadBuilder(project, os=os.type()) {
    let Builder = require(`./builder-${os}.js`);
    return new Builder(project);
  }
}

Builder.BuildFileSearchTypes = buildFilePossibilities;
module.exports.Builder = Builder;
