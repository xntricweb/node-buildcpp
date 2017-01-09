const path = require('path');
const debug = require('debug')('ama:convert2flags');

const typeConversion = {
  exe: 'executable',
  lib: 'static library',
  dll: 'dynamic library'
}

function convert2flags(build) {
  debug("converting build to cflags");
  let args = [];

  if (build.define && build.define.length)
    args.push(...build.define.map( def => '/D' + def ));

  if (build.include && build.include.length)
    args.push(...build.include.map( inc => '/I ' + inc ));

  if (build.cflags && build.cflags.length)
    args.push(...build.cflags.map( flag => '/' + flag ));

  if (build.output) {
    build.target = path.join(build.output, build.target);
    args.push('/Fo' + path.normalize(build.output) + '\\');
  }

  args.push(...build.source);

  if (build.lib)
    args.push(...build.lib);

  if (!build.type)
    build.type = typeConversion[path.parse(build.target).ext] || 'executable';

  if (build.type != 'executable') {
    throw new Error('Libraries are not yet supported');
  }

  args.push('/link', '/OUT:' + build.target);

  if (build.lflags && build.lflags.length)
    args.push(...build.lflags.map( flag => '/' + flag ));

  return args;
}

module.exports = convert2flags;
