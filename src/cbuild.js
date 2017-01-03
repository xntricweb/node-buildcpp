const {spawn} = require('child_process');

const defBuildPros = require('./default-build-props.js');



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
