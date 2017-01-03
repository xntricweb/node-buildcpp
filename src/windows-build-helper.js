const debug = require('debug')('buildcpp:windows-build-helper');
const {spawn} = require('child_process');

class WindowsBuilder extends Builder {

}

module.exports = function(o) {
  let envPromise = new Promise((res, rej) => {
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

  function build(ops) {
    debug('preparing to build')
    envPromise.then((env) => {
      let args = [];
      args.push(...cflags, ...sources, '/link', ..lflags, `/out:${output}`);
      spawn('cl.exe', args, {
        env: env,
        stdio: 'inherit'
      })
      .on('exit', function(code) {
        if (code) throw new Error('Build failed, code: ' + code);
      })
    })
  }

  build.buildProps = {
    buildProps
  }

  return build;
}
