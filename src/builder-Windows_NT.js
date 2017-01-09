const path = require('path');
const {spawn} = require('child_process');
const run = require('./run.js');

const debug = require('debug')('ama:windows-builder');
const mkdirp = require('mkdirp');


const convert2flags = require('./convert2flags-windows.js');
const {Builder} = require('./builder.js');

const WINDOWS_BUILDER_VERSION = "0.0.1";


let defaultBuild = {
  env: {
    arch: 'amd64_x86',
    cflags: ['Wall']
  },
  profile: {
    debug: {
      cflags: ['O0']
    },
    release: {
      cflags: ['O2']
    }
  }
}

class WindowsBuilder extends Builder {
  constructor(o) {
    super(o);
    this.version = WINDOWS_BUILDER_VERSION;
    this.use(defaultBuild);
    debug(`Initialized windows builder (version ${this.version})`);
  }

  _build(build) {
    debug('preparing for windows build');
    return loadBuildEnvironment(build.arch || 'amd_x86')
    .then(mkdir.bind(this, path.resolve(build.projectRoot, build.output)))
    .then(env => {
      debug('starting windows build');
      let cflags = convert2flags(build);
      process.env.Path = env.Path;

      return run('cl.exe', cflags, {env:env, stdio: 'inherit', cwd: build.projectRoot})
      .then((code) => {
        debug('build completed with code ' + code);
        if (code !== 0) {
          let err = new Error(`Build failed with code: ${code}`);
          err.code = code;
          err.build = build;
          throw err;
        }
        return build;
      });
    }, err => {
      debug("preparation failed!");
      debug("%e", err);
      throw err;
    });
  }
}

module.exports = WindowsBuilder;

function loadBuildEnvironment(arch) {
  return new Promise((res, rej) => {
    debug('preparing build environment');

    let data = '';
    let cmd = spawn('cmd.exe', {
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe', 'pipe']
    });
    cmd.stdio[3].on('data', (buf) => {
      data += buf.toString();
    });

    cmd.on('exit', (code)=> {
      let env = {};
      data.split('\r\n').forEach((kv)=>{
        let [k, v] = kv.split('=');
        if (!(k===undefined || v===undefined)) env[k] = v;
      });

      debug('Build environment ready')
      res(env);
    });
    cmd.stdin.write('"%ProgramFiles(x86)%/Microsoft Visual C++ Build Tools/vcbuildtools.bat" ' + arch + '\r\n');
    cmd.stdin.write('set >&3\r\n');
    cmd.stdin.write('exit\r\n');
  });

}

function mkdir(dir, arg) {
  return new Promise((res, rej) => {
    debug('creating build output directory');
    mkdirp(dir, function(err) {
      if (err) return rej(err);
      res(arg);
    });
  });
}
