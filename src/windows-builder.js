const debug = require('debug')('build:windows-builder');
const path = require('path');

const {spawn} = require('child_process');

const Builder = require('./builder.js');
const WINDOWS_BUILDER_VERSION = "0.0.1";

const typeConversion {
  exe: 'executable',
  lib: 'static library',
  dll: 'dynamic library'
}

let defaultBuild = {
  cflags: ['Wall'],
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
    this.addBuildProperties(defaultBuild);
    debug(`Initialized windows builder (version ${this.version})`);
  }

  _build(build) {
    let cflags = convert2CLFlags(build);

    return loadBuildEnvironment()
    .then((env) => {
      return new Promise((res, rej) => {
        spawn('cl.exe', cflags, { env: env, stdio: 'inherit' })
        .on('exit', function(code) {
          if (code) {
            let err = new Error('Build failed, code: ' + code);
            err.code = code;
            err.build = build;

            rej(err);
          }
          res(build);
        })
      })
    });
  }
}

function loadBuildEnvironment(arch) {
  return new Promise((res, rej) => {
    debug('Preparing build environment');

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

function convert2CLFlags(build) {
  debug("converting build to cflags");
  let args = [];

  if (build.define && build.define.length)
    args.push(...build.define.map( def => '/D' + def ));

  if (build.include && build.include.length)
    args.push(...build.include.map( inc => '/I ' + inc ));

  if (build.cflags && build.cflags.length)
    args.push(...build.cflags.map( flag => '/' + flag ));

  args.push(...build.source);

  if (build.lib)
    args.push(...build.lib);

  if (!build.type)
    build.type = typeConversion[path.info(build.output).ext] || 'executable';

  if (build.type != 'executable') {
    throw new Error('Libraries are not yet supported');
  }

  args.push('/link', '/OUT:' + build.output);

  if (build.lflags && build.lflags.length)
    args.push(...build.lflags.map( flag => '/' + flag );

  return args;
}
