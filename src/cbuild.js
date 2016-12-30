const {spawn} = require('child_process');

class CBuild {
    constructor() {
        this.env = Object.create(null);
    }

    build(arch, src, out, flags) {
        return getToolEnv(arch)
        .then((env) => {
            let args = [];
            args.push(...cflags, ...src, '/link', `/out:${out}`);
            spawn('cl.exe', args)
        })
    }
}

module.exports = CBuild;

function getToolEnv(arch) {
    return new Promise((res, rej) => {
        let data = '';
        let cmd = spawn('cmd.exe', {
            stdio: ['pipe', 'pipe', 'pipe', 'pipe']
        })
        cmd.stdio[3].on('data', (buf) => {
            data += buf.toString();
        });
        cmd.on('exit', (code)=> {
            let env = {};
            data.split('\r\n').forEach((kv)=>{
                let [k, v] = kv.split('=');
                if (!(k===undefined || v===undefined)) env[k] = v;
            });
            res(env);
        });
        cmd.stdin.write('"C:/Program Files (x86)/Microsoft Visual C++ Build Tools/vcbuildtools.bat" ' + arch + '\r\n');
        cmd.stdin.write('set >&3\r\n');
        cmd.stdin.write('exit\r\n');
    })
}

