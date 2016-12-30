const builder = require('../cbuild.js');

const fs = require('fs');
const path = require('path');

fs.readFile('./package.json', (err, data) => {
    if (err) throw err;
    let package;
    try {
        package = JSON.parse(data);
    } catch(e) {
        throw e;
    }

    if (!package.build) {
        throw new Error('Nothing to build in package');
    }

    let pkg = getBuildPackage(package);
    buildPackage(pkg);
});

function getBuildPackage(package) {
    let build = package.build;
    if (!build.name) build.name = package.name;

    return build;
}

function buildPackage(pkg) {
    let bldr = new CBuild();
    if (process.env.CFLAGS)
        bldr.addCFlags(process.env.CFLAGS);
    if (pkg.cflags)
        bldr.addCFlags(pkg.cflags);
    
    return pkg.files.map(buildFile);
}

function buildFile(bldr, file) {
    file = fixFile(file);
    if (file instanceof Error) return Promise.reject(file);

    return bldr.build(file.src, file.out, file.cflags);
}

function fixFile(file, index) {
    if (typeof file === 'string') {
        let name = path.parse(file).name
        file = {
            src: [file],
            out: `${name}.exe`
        };
    }

    if (!file.src) 
        return new Error('No sources for file: ' + (file.out || index));
    if (!(file.src instanceof Array)) file.src = [file.src];

    if (!file.cflags) file.cflags = [];
    if (!(file.cflags instanceof Array)) file.cflags = [file.cflags];

    if (!file.out) {
        let name = path.parse(file.src[0]).name;
        file.out = name + '.exe';
    }

    return file;
}
